import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { fetchPosts, toPostRow } from '../../api/posts';
import type { PostInput, PostRow, PostsResponse } from '../../api/posts';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { Input } from '../../components/Input';
import { Pagination } from '../../components/Pagination';
import { Table } from '../../components/Table';
import type { TableColumn } from '../../components/Table';

import DeleteConfirmModal from './DeleteConfirmModal';
import PostFormModal from './PostFormModal';
import PostsErrorAlert from './PostsErrorAlert';
import { changedFields } from './postForm';
import { normalizeSearch, POSTS_PAGE_SIZE, POSTS_REQUEST_OPTIONS } from './postsConfig';
import { isLocalPostId } from './postsOverlay';
import { usePostsOverlay } from './usePostsOverlay';

/**
 * 입력이 멈춘 뒤 검색을 반영하기까지 기다리는 시간 (ms)
 */
const SEARCH_DEBOUNCE_MS = 300;

const SEARCH_INPUT_ID = 'posts-search';
const SEARCH_HINT_ID = 'posts-search-hint';

/**
 * 응답 + 그 응답을 받은 요청의 검색어
 */
interface SearchedPostsResponse extends PostsResponse {
    q: string;
}

/**
 * 목록 조회 오류 문구
 * 네트워크 오류(fetch가 던지는 TypeError, 예: 오프라인의 "Failed to fetch")는 한국어 안내로 바꾸고,
 * HTTP 오류는 fetchPosts가 만든 문구를 그대로 쓴다.
 * 한계: TypeError는 모두 네트워크 오류로 본다. 코드 버그로 난 TypeError도 "네트워크 연결을 확인해 주세요"로 보인다.
 */
function listErrorMessage(error: Error) {
    return error instanceof TypeError
        ? '게시글 목록을 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.'
        : error.message;
}

/**
 * URL의 ?page= 값을 1 이상의 정수로 읽는다.
 * 값이 없거나 잘못됐으면 1페이지로 본다. (?page=abc, ?page=-3 등)
 */
function parsePage(value: string | null) {
    const page = Number(value);

    return Number.isInteger(page) && page >= 1 ? page : 1;
}

/**
 * 열린 폼: 추가 / 그 행 수정 / 닫힘(null)
 */
type PostForm = { mode: 'add' } | { mode: 'edit'; row: PostRow } | null;

/**
 * 제출로 모달이 닫힌 뒤 열기 버튼을 무시하는 시간 (ms)
 *
 * 제출하면 모달이 바로 닫히고 포커스가 열었던 버튼(추가·수정)으로 돌아온다.
 * 이때 Enter를 한 번 더 누른 사람(연타)의 키가 그 버튼에 들어가면 빈 모달이 곧바로 다시 열린다.
 * 사용자는 "제출"을 눌렀을 뿐이므로, 제출로 닫힌 직후 잠깐은 열기 동작을 무시한다.
 * ESC·취소로 닫은 경우에는 적용하지 않는다. (바로 다시 열 수 있어야 한다)
 */
const REOPEN_GUARD_MS = 300;

/**
 * 열기 버튼에서 길게 누른 Enter(키 반복)는 무시한다.
 * 키 반복은 보통 0.25~0.6초 뒤에 시작해 REOPEN_GUARD_MS보다 늦게 올 수 있으므로 따로 막는다.
 * (버튼은 Enter keydown마다 클릭되므로 반복 keydown의 기본 동작을 막는다)
 */
function ignoreRepeatedEnter(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' && event.repeat) event.preventDefault();
}

interface SelectAllCheckboxProps {
    checked: boolean;
    /**
     * 일부만 선택됨 (가로줄 표시, 스크린리더는 "부분 선택"으로 읽는다)
     */
    indeterminate: boolean;
    disabled: boolean;
    onChange: () => void;
}

/**
 * "현재 페이지 전체 선택" 체크박스
 * indeterminate는 HTML 속성이 아니라 DOM 속성이라 ref로 준다.
 */
function SelectAllCheckbox({ checked, indeterminate, disabled, onChange }: SelectAllCheckboxProps) {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <Checkbox
            ref={ref}
            aria-label="현재 페이지 전체 선택"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
        />
    );
}

interface ColumnOptions {
    onEdit: (row: PostRow) => void;
    onDelete: (row: PostRow) => void;

    /**
     * 지금 선택된 행 id (화면에 보이는 행만)
     */
    selectedIds: readonly number[];

    /**
     * 지금 보이는 행 수 (전체 선택 상태 계산용)
     */
    rowCount: number;
    onToggleRow: (id: number) => void;
    onToggleAll: () => void;
}

/**
 * 표 컬럼
 * 선택·수정·삭제가 행마다 다른 동작을 하므로 핸들러와 선택 상태를 받아 만든다.
 */
function createColumns({
    onEdit,
    onDelete,
    selectedIds,
    rowCount,
    onToggleRow,
    onToggleAll,
}: ColumnOptions): TableColumn<PostRow>[] {
    const allChecked = rowCount > 0 && selectedIds.length === rowCount;

    return [
        {
            dataIndex: 'id',
            title: (
                <SelectAllCheckbox
                    checked={allChecked}
                    indeterminate={selectedIds.length > 0 && !allChecked}
                    disabled={rowCount === 0}
                    onChange={onToggleAll}
                />
            ),
            width: '48px',
            align: 'center',
            render: (_, row) => (
                <Checkbox
                    // 체크박스만으로도 어느 행인지 알 수 있게 제목을 이름에 넣는다.
                    aria-label={`'${row.title}' 선택`}
                    checked={selectedIds.includes(row.id)}
                    onChange={() => onToggleRow(row.id)}
                />
            ),
        },
        {
            dataIndex: 'id',
            title: '번호',
            width: '80px',
            // 추가한 행의 음수 임시 id는 화면·접근 가능한 이름 어디에도 보이지 않게 "신규"로 바꾼다.
            render: (_, row) => (isLocalPostId(row.id)
                ? <Badge variant="neutral">신규</Badge>
                : row.id),
        },
        { dataIndex: 'title', title: '제목' },
        ...dataColumns,
        {
            dataIndex: 'id',
            title: '관리',
            width: '168px',
            align: 'center',
            render: (_, row) => (
                // 버튼만으로도 어느 행인지 알 수 있게 제목을 이름에 넣는다.
                <div className="ui-table__actions">
                    <Button
                        variant="outline"
                        color="neutral"
                        aria-label={`'${row.title}' 수정`}
                        onClick={() => onEdit(row)}
                        onKeyDown={ignoreRepeatedEnter}
                    >
                        수정
                    </Button>
                    <Button
                        variant="outline"
                        color="neutral"
                        aria-label={`'${row.title}' 삭제`}
                        onClick={() => onDelete(row)}
                        onKeyDown={ignoreRepeatedEnter}
                    >
                        삭제
                    </Button>
                </div>
            ),
        },
    ];
}

const dataColumns: TableColumn<PostRow>[] = [
    {
        dataIndex: 'tags',
        title: '태그',
        width: '280px',
        render: (_, row) => (
            <ul className="ui-posts__tags">
                {row.tags.map((tag) => (
                    <li key={tag}>
                        <Badge variant="tag">{tag}</Badge>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        dataIndex: 'likes',
        title: '좋아요',
        width: '100px',
        align: 'right',
        render: (_, row) => row.likes.toLocaleString(),
    },
    {
        dataIndex: 'views',
        title: '조회수',
        width: '100px',
        align: 'right',
        render: (_, row) => row.views.toLocaleString(),
    },
];

function PostsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parsePage(searchParams.get('page'));
    // URL의 ?q= 가 검색어의 기준이다. (새로고침·뒤로가기에서 그대로 복원된다)
    const q = normalizeSearch(searchParams.get('q'));

    /**
     * 검색 입력값
     * 입력 중인 값(inputValue)과 반영된 검색어(q)는 다를 수 있다.
     * 디바운스가 끝나거나 Enter를 누르면 inputValue가 URL로 반영된다.
     */
    const [inputValue, setInputValue] = useState(q);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isComposing, setIsComposing] = useState(false);

    /**
     * 이번 입력 묶음에서 이미 history에 기록했는지
     * 첫 반영은 push(뒤로가기 대상), 이어서 입력해 바뀌는 값은 replace로 덮어써
     * 입력 중에는 history가 쌓이지 않는다.
     * 포커스가 빠지거나, Enter·지우기·페이지 이동을 하거나, 뒤로가기 등으로 q가 바깥에서 바뀌면 묶음이 끝난다.
     */
    const [isEditingEntry, setIsEditingEntry] = useState(false);

    /**
     * 이 화면이 URL에 반영했지만 아직 q로 돌아오지 않은 검색어들
     * URL 반영은 transition이라 늦게 도착할 수 있다. 그 사이 더 입력한 글자를 지우지 않도록,
     * 돌아온 q가 이 목록에 있으면 내가 반영한 값으로 보고 입력값을 건드리지 않는다.
     */
    const [pendingQs, setPendingQs] = useState<string[]>([]);

    /**
     * 뒤로가기·앞으로가기처럼 q가 바깥에서 바뀌었을 때만 입력값을 URL에 맞춘다.
     * (렌더 중에 이전 값과 비교해 맞추는 방식. effect에서 setState하지 않는다)
     */
    const [syncedQ, setSyncedQ] = useState(q);
    if (syncedQ !== q) {
        setSyncedQ(q);

        const pendingIndex = pendingQs.indexOf(q);
        if (pendingIndex >= 0) {
            setPendingQs(pendingQs.slice(pendingIndex + 1));
        } else {
            setPendingQs([]);
            setIsEditingEntry(false);
            if (normalizeSearch(inputValue) !== q) setInputValue(q);
        }
    }

    /**
     * 가장 최근에 반영한 검색어 (아직 URL에서 돌아오지 않았으면 그 값)
     */
    const latestQ = pendingQs.at(-1) ?? q;

    /**
     * 검색어를 URL에 반영한다. 검색어가 바뀌면 page는 지워 1페이지로 돌아간다.
     * - endEntry: 이번 반영으로 입력 묶음을 끝낸다. (Enter·지우기)
     * - push: 묶음 중이어도 replace하지 않고 새 기록을 남긴다. (지우기)
     */
    const commitSearch = (
        value: string,
        { endEntry = false, push = false }: { endEntry?: boolean; push?: boolean } = {},
    ) => {
        const keyword = normalizeSearch(value);

        if (keyword !== latestQ) {
            setPendingQs([...pendingQs, keyword]);
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (keyword) next.set('q', keyword);
                    else next.delete('q');
                    next.delete('page');

                    return next;
                },
                { replace: isEditingEntry && !push },
            );
        }

        setIsEditingEntry(!endEntry && (isEditingEntry || keyword !== latestQ));
    };

    // 최신 commitSearch를 디바운스 타이머에서 쓰기 위한 ref
    const commitSearchRef = useRef(commitSearch);
    useEffect(() => {
        commitSearchRef.current = commitSearch;
    });

    /**
     * 디바운스: 입력이 300ms 멈추면 반영한다.
     * 한글 조합 중(isComposing)에는 타이머를 걸지 않고, 조합이 끝나면 그때부터 기다린다.
     */
    useEffect(() => {
        if (isComposing) return;

        const timer = window.setTimeout(() => {
            commitSearchRef.current(inputValue);
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timer);
    }, [inputValue, isComposing]);

    /**
     * 검색어 지우기 (Esc, 입력창의 지우기 버튼, 빈 상태의 버튼)
     * 디바운스를 기다리지 않고 바로 반영하고, 포커스는 입력창으로 돌려준다.
     */
    const clearSearch = () => {
        setInputValue('');
        commitSearch('', { endEntry: true, push: true });
        searchInputRef.current?.focus();
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        // 조합 중 Enter·Esc는 IME가 쓰는 키라 건드리지 않는다.
        if (event.nativeEvent.isComposing) return;

        if (event.key === 'Escape' && inputValue !== '') {
            event.preventDefault();
            clearSearch();
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            commitSearch(inputValue, { endEntry: true });
        }
    };

    const {
        data,
        isPending,
        isError,
        error,
        isPlaceholderData,
        isFetching,
        refetch,
    } = useQuery({
        ...POSTS_REQUEST_OPTIONS,
        queryKey: ['posts', { q, page, limit: POSTS_PAGE_SIZE }],
        // signal을 넘기므로 검색어·페이지가 바뀌면 이전 요청은 react-query가 취소한다.
        // 응답에 이 요청의 검색어(q)를 붙여, 화면에 보이는 목록이 어떤 검색의 결과인지 알 수 있게 한다.
        queryFn: async ({ signal }): Promise<SearchedPostsResponse> => {
            const response = await fetchPosts({
                limit: POSTS_PAGE_SIZE,
                skip: (page - 1) * POSTS_PAGE_SIZE,
                q,
                signal,
            });

            return { ...response, q };
        },
        // 페이지를 넘기거나 검색하는 동안 이전 목록을 그대로 보여준다. (깜빡임 방지)
        placeholderData: keepPreviousData,
        // 기본값(3회)이면 오류 화면이 7초 넘게 늦게 뜬다. 1회만 다시 시도하고 사용자에게 맡긴다.
        retry: 1,
        select: (response) => ({
            rows: response.posts.map(toPostRow),
            total: response.total,
            // 지금 화면에 보이는 목록의 페이지.
            // 페이지 이동 중에는 URL(page)이 먼저 바뀌고 목록은 이전 것이라 둘이 다를 수 있다.
            // (응답의 limit은 실제 개수로 줄어들 수 있어 POSTS_PAGE_SIZE로 계산한다)
            shownPage: Math.floor(response.skip / POSTS_PAGE_SIZE) + 1,
            // 지금 화면에 보이는 목록의 검색어 (검색 중에는 URL의 q와 다를 수 있다)
            shownQ: response.q,
        }),
    });

    /**
     * 서버 목록 + 내 변경분(추가·수정)
     * 목록·총 건수·총 페이지 수·요약 문구는 모두 이 값으로 그린다. (서버 total을 직접 쓰지 않는다)
     * 합칠 때는 지금 보이는 목록의 검색어·페이지(shownQ, shownPage)를 쓴다.
     */
    const {
        overlay,
        merge,
        addPost,
        editPost,
        removePosts,
        error: mutationError,
        reportError,
        clearError,
        isMutating,
    } = usePostsOverlay();
    const merged = data
        ? merge({ rows: data.rows, total: data.total, q: data.shownQ, page: data.shownPage })
        : null;

    const total = merged?.total ?? 0;
    const totalPages = Math.ceil(total / POSTS_PAGE_SIZE);

    /**
     * 이 조회가 직접 받은 목록이 있는지
     * 페이지 이동 중 보여주는 이전 목록(placeholder)은 제외한다. (URL의 페이지와 내용이 달라서)
     * 있으면 다시 불러오기가 실패해도 표를 지우지 않는다. (오프라인에서 창 포커스로 다시 불러올 때 등)
     */
    const hasOwnData = !!data && !isPlaceholderData;

    /**
     * 추가·수정 폼
     * 열린 동안만 그리므로 열 때마다 빈 상태에서 시작한다.
     * 닫히면 Modal이 열기 전 포커스(추가 버튼 또는 그 행의 수정 버튼)로 돌려준다.
     */
    const [form, setForm] = useState<PostForm>(null);

    // 목록 제목 (알림을 닫거나 수정할 행이 사라졌을 때 포커스를 옮길 곳)
    const listTitleRef = useRef<HTMLHeadingElement>(null);

    // 마지막으로 제출해 모달이 닫힌 시각 (REOPEN_GUARD_MS 참고)
    // 렌더에 쓰이지 않는 값이라 원래는 ref가 맞지만, 이 값을 읽는 openForm을 렌더 중에 만드는 columns에 넘기므로
    // React Compiler 린트(react-hooks/refs)가 "렌더 중 ref 접근"으로 막는다. 그래서 state로 둔다.
    // (제출할 때만 바뀌므로 다시 그리는 비용은 작다)
    const [submittedAt, setSubmittedAt] = useState(-Infinity);
    const openForm = useCallback((next: NonNullable<PostForm>) => {
        if (performance.now() - submittedAt < REOPEN_GUARD_MS) return;
        setForm(next);
    }, [submittedAt, setForm]);
    const rows = merged?.rows ?? [];

    /**
     * 행 선택 (일괄 삭제용)
     * 페이지나 검색어가 바뀌면 선택을 비운다. 안 보이는 행이 선택된 채 남아 실수로 함께 지워지는 것을 막는다.
     * (렌더 중에 이전 값과 비교해 맞추는 방식. effect에서 setState하지 않는다)
     */
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const selectionKey = `${q}\u0000${page}`;
    const [selectionFor, setSelectionFor] = useState(selectionKey);
    if (selectionFor !== selectionKey) {
        setSelectionFor(selectionKey);
        setSelectedIds([]);
    }

    // 지금 화면에 보이는 행 중 선택된 것 (롤백·삭제로 사라진 행은 빠진다)
    const selectedRows = rows.filter((row) => selectedIds.includes(row.id));
    const visibleSelectedIds = selectedRows.map((row) => row.id);

    const toggleRow = (id: number) => setSelectedIds((prev) => (
        prev.includes(id) ? prev.filter((selected) => selected !== id) : [...prev, id]
    ));
    const toggleAll = () => setSelectedIds(
        visibleSelectedIds.length === rows.length ? [] : rows.map((row) => row.id),
    );

    /**
     * 삭제 확인 (1건 또는 선택한 여러 건)
     * 닫히면 Modal이 열기 전 포커스(눌렀던 삭제·선택 삭제 버튼)로 돌려준다.
     */
    const [deleteTargets, setDeleteTargets] = useState<PostRow[] | null>(null);

    const columns = createColumns({
        onEdit: (row) => openForm({ mode: 'edit', row }),
        onDelete: (row) => setDeleteTargets([row]),
        selectedIds: visibleSelectedIds,
        rowCount: rows.length,
        onToggleRow: toggleRow,
        onToggleAll: toggleAll,
    });

    /**
     * 삭제 확정
     * 낙관적으로 행을 지우고, 실패하면 그 행만 되살려 오류 알림으로 알린다. (usePostsOverlay.removePosts)
     * 추가한 행(임시 id)은 서버 요청 없이 사라진다.
     */
    const handleDeleteConfirm = () => {
        // 모달이 열린 동안 행이 바뀌었을 수 있다. (이전 수정의 롤백 등)
        // 확정 시점의 행(지금 화면 → 변경분의 추가한 행 → 열 때의 행)을 넘겨야 삭제 스냅샷의 제목이 맞는다.
        // (추가가 실패해 사라진 행은 removePosts가 아무것도 하지 않는다)
        const targets = (deleteTargets ?? []).map((target) => (
            rows.find((row) => row.id === target.id)
            ?? overlay.added.find((row) => row.id === target.id)
            ?? target
        ));

        removePosts(targets);
        setSelectedIds([]);

        // 지운 행의 삭제 버튼(또는 선택 삭제 버튼)이 사라지므로 포커스를 목록 제목으로 옮긴다.
        window.setTimeout(() => listTitleRef.current?.focus());
    };

    /**
     * 폼 제출
     * submittedAtMs는 모달이 넘겨준 제출 이벤트의 timeStamp다. (performance.now()와 같은 기준)
     * 여기서 시각을 직접 재지 않아 렌더 순수성 규칙(react-hooks/purity)과 부딪히지 않는다.
     */
    const handleFormSubmit = (input: PostInput, submittedAtMs: number) => {
        setSubmittedAt(submittedAtMs);

        if (form?.mode === 'edit') {
            const opened = form.row;

            // "찾을 수 없음"은 추가한 행(임시 id)이 변경분에서 사라진 경우만이다. (추가 요청이 실패해 롤백됨 등)
            // 서버 행은 지금 화면에 없더라도(모달이 열린 동안 뒤로가기로 다른 페이지가 보이는 등) 서버에는 있으므로 저장한다.
            if (isLocalPostId(opened.id) && !overlay.added.some((row) => row.id === opened.id)) {
                reportError(`'${opened.title}' 게시글을 찾을 수 없어 수정하지 못했습니다. 목록을 확인해 주세요.`);
                // 모달이 닫히면 열었던 수정 버튼도 이미 없으므로 포커스를 목록 제목으로 옮긴다.
                window.setTimeout(() => listTitleRef.current?.focus());
                return;
            }

            /**
             * 비교 기준: 지금 화면에 보이는 행 → (추가한 행이면) 변경분의 행 → 열 때의 행
             * 모달이 열린 동안 행이 바뀌었을 수 있다. (이전 수정의 롤백 등)
             * 의도: 모달에서 사용자가 본 값이 그대로 저장되게, 현재 행과 폼 값 전체를 비교한다.
             * 그래서 사용자가 손대지 않은 필드도 현재 행과 다르면 열 때의 값으로 저장될 수 있다. (README 한계 참고)
             */
            const current = merged?.rows.find((row) => row.id === opened.id)
                ?? overlay.added.find((row) => row.id === opened.id)
                ?? opened;

            const patch = changedFields(current, input);
            // 바뀐 것이 없으면 요청하지 않고 닫기만 한다.
            if (Object.keys(patch).length > 0) editPost(current, patch);
            return;
        }

        addPost(input);

        // 추가한 행은 1페이지 맨 앞에 보이므로 1페이지로 옮긴다. (검색어는 유지)
        if (page !== 1) {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete('page');

                return next;
            });
        }
    };

    // 알림을 닫으면 닫기 버튼이 사라지므로 포커스를 목록 제목으로 옮긴다.
    const handleCloseAlert = () => {
        clearError();
        listTitleRef.current?.focus();
    };

    /**
     * 요약 문구
     * - 목록: "총 N건 · M페이지 중 K페이지"
     * - 검색: "'react' 검색 결과 N건 · M페이지 중 K페이지"
     * ?page=999처럼 전체 페이지보다 큰 값이면 그 페이지가 없다고 알린다.
     * 검색 결과가 0건이면 페이지 안내는 붙이지 않는다.
     */
    const summaryText = (() => {
        if (!data) return '';

        const countText = data.shownQ
            ? `'${data.shownQ}' 검색 결과 ${total.toLocaleString()}건`
            : `총 ${total.toLocaleString()}건`;

        if (total === 0) return countText;

        return data.shownPage > totalPages
            ? `${countText} · ${data.shownPage}페이지는 없습니다. (전체 ${totalPages}페이지)`
            : `${countText} · ${totalPages}페이지 중 ${data.shownPage}페이지`;
    })();

    // 검색 결과가 없을 때의 빈 상태 (검색어 없이 0건이면 표의 emptyMessage를 쓴다)
    // 새 검색을 불러오는 중(isPlaceholderData)에는 빈 상태 대신 표의 로딩 표시를 보여준다.
    const isSearchEmpty = !!data && total === 0 && data.shownQ !== '' && !isPlaceholderData;

    /**
     * 이 페이지의 행이 삭제로 모두 사라졌지만 다른 페이지에는 게시글이 남은 경우
     * 오류가 아니므로 빈 표 대신 안내와 "첫 페이지로"를 보여준다. (총 건수가 0이면 기존 빈 상태를 쓴다)
     * 1페이지에서는 서버가 다음 행을 채워 주지 않으므로(DummyJSON은 삭제를 저장하지 않음) 안내만 보여준다.
     * 서버가 준 행이 있었을 때만 해당한다. 범위를 벗어난 페이지(?page=999)처럼 서버가 처음부터 0행을 주면
     * 지운 것이 없으므로 기존 표의 빈 상태와 요약의 "N페이지는 없습니다"를 쓴다.
     */
    const isPageCleared = hasOwnData && !isError
        && data.rows.length > 0 && rows.length === 0 && total > 0;

    const goToFirstPage = () => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete('page');

            return next;
        });
        // 버튼이 사라지므로 포커스를 목록 제목으로 옮긴다.
        listTitleRef.current?.focus();
    };

    /**
     * 페이지 이동
     * setSearchParams는 기본으로 history에 기록을 쌓으므로 뒤로가기가 동작한다.
     * 디바운스를 기다리는 검색어가 있으면 같은 이동에 함께 반영한다. (page가 1로 덮어쓰이지 않게)
     * 대기 중인 타이머는 나중에 실행돼도 latestQ와 같아 아무 일도 하지 않는다.
     */
    const handlePageChange = (nextPage: number) => {
        const keyword = normalizeSearch(inputValue);
        const hasPendingKeyword = keyword !== latestQ;

        if (hasPendingKeyword) setPendingQs([...pendingQs, keyword]);
        setIsEditingEntry(false);

        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (hasPendingKeyword) {
                if (keyword) next.set('q', keyword);
                else next.delete('q');
            }
            next.set('page', String(nextPage));

            return next;
        });
    };

    return (
        <main className="ui-doc ui-posts">
            <h1 className="ui-doc__title">게시글 관리</h1>

            <div className="ui-posts__notice">
                <p>데모 API: 변경은 화면에만 반영돼요</p>
                <p id={SEARCH_HINT_ID}>
                    DummyJSON 데이터는 영어라서 한글로 검색하면 결과가 없을 수 있어요
                </p>
            </div>

            <section className="ui-doc__section">
                <div className="ui-posts__header">
                    {/* 알림을 닫거나 수정할 행이 사라졌을 때 포커스를 받는다 (tabIndex -1: Tab 순서에는 넣지 않음) */}
                    <h2 ref={listTitleRef} className="ui-posts__title" tabIndex={-1}>
                        게시글 목록
                    </h2>

                    <Button onClick={() => openForm({ mode: 'add' })} onKeyDown={ignoreRepeatedEnter}>
                        게시글 추가
                    </Button>
                </div>

                {/* 추가·수정 실패 알림 (오류 전용 영역. 항상 DOM에 있고 내용만 바뀐다) */}
                <PostsErrorAlert error={mutationError} onClose={handleCloseAlert} />

                <div className="ui-posts__search" role="search">
                    <Input
                        ref={searchInputRef}
                        id={SEARCH_INPUT_ID}
                        label="게시글 검색"
                        layout="row"
                        type="text"
                        enterKeyHint="search"
                        autoComplete="off"
                        placeholder="제목·본문 검색 (예: love)"
                        aria-describedby={SEARCH_HINT_ID}
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={(event) => {
                            // 조합이 끝난 최종 글자를 확실히 반영한 뒤 디바운스를 다시 건다.
                            setInputValue(event.currentTarget.value);
                            setIsComposing(false);
                        }}
                        onKeyDown={handleSearchKeyDown}
                        onBlur={() => {
                            setIsEditingEntry(false);
                            // 조합 중에 포커스가 빠져 compositionend가 오지 않아도 디바운스가 멈추지 않게 한다.
                            setIsComposing(false);
                        }}
                        clearable={inputValue !== ''}
                        onClear={clearSearch}
                    />
                </div>

                {/* 페이지·검색 결과가 바뀔 때마다 스크린리더가 읽어준다 (live 영역은 이것 하나) */}
                <p className="ui-posts__summary" aria-live="polite">
                    {summaryText}
                </p>

                {isError && !hasOwnData ? (
                    <div className="ui-posts__error" role="alert">
                        <p className="ui-posts__error-message">
                            {listErrorMessage(error)}
                        </p>

                        <Button
                            variant="outline"
                            color="neutral"
                            onClick={() => refetch()}
                            disabled={isFetching}
                        >
                            다시 시도
                        </Button>
                    </div>
                ) : isSearchEmpty ? (
                    // 결과 건수는 위 요약 문구(aria-live)가 읽으므로 여기는 live 영역이 아니다
                    <div className="ui-posts__empty">
                        <p className="ui-posts__empty-message">
                            &apos;{data.shownQ}&apos;에 대한 결과가 없습니다.
                        </p>

                        <Button
                            variant="outline"
                            color="neutral"
                            onClick={clearSearch}
                        >
                            검색어 지우기
                        </Button>
                    </div>
                ) : (
                    // 페이지 이동 중(isPlaceholderData): 이전 목록 위에 로딩을 덮는다
                    // 이동이 끝나면 위 요약 문구(aria-live)가 결과를 읽어준다
                    // 추가·수정 요청이 진행 중이면 목록 영역에 aria-busy를 준다.
                    <div className="ui-posts__list" aria-busy={isMutating || undefined}>
                        {/* 이미 받은 목록이 있는데 다시 불러오기(창 포커스, 다시 시도 등)만 실패한 경우:
                            표는 그대로 두고 안내만 덧붙인다. */}
                        {isError && (
                            <div className="ui-posts__stale" role="alert">
                                <p className="ui-posts__stale-message">
                                    {listErrorMessage(error)} 마지막으로 불러온 목록을 보여 줍니다.
                                </p>

                                <Button
                                    variant="outline"
                                    color="neutral"
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                >
                                    다시 시도
                                </Button>
                            </div>
                        )}

                        {/* 선택한 행이 있을 때만 보이는 일괄 작업 바 */}
                        {visibleSelectedIds.length > 0 && (
                            <div className="ui-posts__selection">
                                <p className="ui-posts__selection-count">
                                    {visibleSelectedIds.length}개 선택됨
                                </p>

                                <Button
                                    variant="outline"
                                    color="neutral"
                                    onClick={() => setDeleteTargets(selectedRows)}
                                    onKeyDown={ignoreRepeatedEnter}
                                >
                                    선택 삭제
                                </Button>
                            </div>
                        )}

                        {isPageCleared ? (
                            <div className="ui-posts__cleared">
                                <p className="ui-posts__cleared-message">
                                    이 페이지의 게시글이 모두 삭제되었습니다.
                                </p>

                                {page !== 1 && (
                                    <Button variant="outline" color="neutral" onClick={goToFirstPage}>
                                        첫 페이지로
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table<PostRow>
                                columns={columns}
                                data={rows}
                                loading={isPending}
                                refreshing={isPlaceholderData}
                                refreshingMessage={
                                    data && data.shownQ !== q
                                        ? '검색 결과를 불러오는 중입니다.'
                                        : '다음 페이지를 불러오는 중입니다.'
                                }
                                emptyMessage={
                                    isPlaceholderData
                                        ? '검색 결과를 불러오는 중입니다.'
                                        : '게시글이 없습니다.'
                                }
                                selectedIds={visibleSelectedIds}
                                ariaLabel="게시글 목록"
                            />
                        )}
                    </div>
                )}

                {totalPages > 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        ariaLabel="게시글 목록 페이지"
                        className="ui-posts__pagination"
                    />
                )}
            </section>

            {form && (
                <PostFormModal
                    mode={form.mode}
                    row={form.mode === 'edit' ? form.row : undefined}
                    onSubmit={handleFormSubmit}
                    onClose={() => setForm(null)}
                />
            )}

            {deleteTargets && (
                <DeleteConfirmModal
                    rows={deleteTargets}
                    onConfirm={handleDeleteConfirm}
                    onClose={() => setDeleteTargets(null)}
                />
            )}
        </main>
    );
}

export default PostsPage;
