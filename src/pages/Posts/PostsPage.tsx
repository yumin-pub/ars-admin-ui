import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { fetchPosts, toPostRow } from '../../api/posts';
import type { PostRow, PostsResponse } from '../../api/posts';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Pagination } from '../../components/Pagination';
import { Table } from '../../components/Table';
import type { TableColumn } from '../../components/Table';

/**
 * 한 페이지에 보여줄 게시글 수
 */
const PAGE_SIZE = 10;

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
 * URL의 ?page= 값을 1 이상의 정수로 읽는다.
 * 값이 없거나 잘못됐으면 1페이지로 본다. (?page=abc, ?page=-3 등)
 */
function parsePage(value: string | null) {
    const page = Number(value);

    return Number.isInteger(page) && page >= 1 ? page : 1;
}

const columns: TableColumn<PostRow>[] = [
    { dataIndex: 'id', title: '번호', width: '80px' },
    { dataIndex: 'title', title: '제목' },
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
    const q = (searchParams.get('q') ?? '').trim();

    /**
     * 검색 입력값
     * 입력 중인 값(inputValue)과 반영된 검색어(q)는 다를 수 있다.
     * 디바운스가 끝나거나 Enter를 누르면 inputValue가 URL로 반영된다.
     */
    const [inputValue, setInputValue] = useState(q);
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
            if (inputValue.trim() !== q) setInputValue(q);
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
        const keyword = value.trim();

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
        // Input이 ref를 받지 않아 id로 찾는다.
        document.getElementById(SEARCH_INPUT_ID)?.focus();
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
        queryKey: ['posts', { q, page, limit: PAGE_SIZE }],
        // signal을 넘기므로 검색어·페이지가 바뀌면 이전 요청은 react-query가 취소한다.
        // 응답에 이 요청의 검색어(q)를 붙여, 화면에 보이는 목록이 어떤 검색의 결과인지 알 수 있게 한다.
        queryFn: async ({ signal }): Promise<SearchedPostsResponse> => {
            const response = await fetchPosts({
                limit: PAGE_SIZE,
                skip: (page - 1) * PAGE_SIZE,
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
            // (응답의 limit은 실제 개수로 줄어들 수 있어 PAGE_SIZE로 계산한다)
            shownPage: Math.floor(response.skip / PAGE_SIZE) + 1,
            // 지금 화면에 보이는 목록의 검색어 (검색 중에는 URL의 q와 다를 수 있다)
            shownQ: response.q,
        }),
    });

    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

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
     * 페이지 이동
     * setSearchParams는 기본으로 history에 기록을 쌓으므로 뒤로가기가 동작한다.
     * 디바운스를 기다리는 검색어가 있으면 같은 이동에 함께 반영한다. (page가 1로 덮어쓰이지 않게)
     * 대기 중인 타이머는 나중에 실행돼도 latestQ와 같아 아무 일도 하지 않는다.
     */
    const handlePageChange = (nextPage: number) => {
        const keyword = inputValue.trim();
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
                <h2 className="ui-doc__section-title">
                    게시글 목록
                </h2>

                <div className="ui-posts__search" role="search">
                    <Input
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

                {isError ? (
                    <div className="ui-posts__error" role="alert">
                        <p className="ui-posts__error-message">
                            {error.message}
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
                    <Table<PostRow>
                        columns={columns}
                        data={data?.rows ?? []}
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
                        ariaLabel="게시글 목록"
                    />
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
        </main>
    );
}

export default PostsPage;
