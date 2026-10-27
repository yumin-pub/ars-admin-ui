/* ==========================
 * 게시글 변경분 (overlay)
 *
 * DummyJSON은 추가·수정·삭제를 저장하지 않아 목록을 다시 불러오면 변경이 사라진다.
 * 그래서 서버 원본(react-query 목록)과 내 변경분을 나눠 두고, 화면에는 합쳐서 보여준다.
 * 실제 서버를 쓰게 되면 이 층만 걷어내면 된다.
 *
 * 수정·삭제는 요청 번호(requestId)로 구분한다.
 * - 수정: id별로 확정된 값(confirmed)과 대기 중인 요청 목록(pending)을 따로 둔다.
 *   화면 값은 필드마다 요청 번호가 가장 큰 값(확정·대기 중 어느 쪽이든)이다.
 *   = 확정 값 위에 대기 요청을 번호 순서대로 얹은 것.
 *   성공하면 확정으로 옮기고(더 나중 요청이 이미 확정한 필드는 덮지 않는다), 실패하면 그 요청만 뺀다.
 *   그래서 요청이 어떤 순서로 실패·성공해도, 같은 값으로 두 번 바꿔도 다른 요청의 값을 건드리지 않는다.
 * - 삭제: id별로 그 삭제를 맡은 요청 번호를 둔다. 이미 삭제 중이거나 삭제된 행은 다시 요청하지 않는다.
 *
 * 여기 있는 함수는 모두 순수 함수다. 입력을 바꾸지 않고 새 객체를 돌려주며,
 * 바뀐 것이 없으면 받은 객체를 그대로 돌려준다. (참조 비교로 변경 여부를 알 수 있다)
 *
 * 알려진 한계
 * - 추가한 행은 1페이지 맨 앞에 붙고 잘라내지 않는다. 그래서 1페이지는 POSTS_PAGE_SIZE보다 많을 수 있다.
 * - 추가한 행은 총 건수에 들어가 총 페이지 수를 늘리지만, 그 행은 1페이지에만 보인다.
 *   (화면은 추가가 접수되면 검색어를 유지한 채 1페이지로 이동한다)
 * - 검색어가 있을 때 새 제목이 검색어에 맞지 않으면 추가한 행은 1페이지에서도 보이지 않고 총 건수에도 들어가지 않는다.
 * - 추가한 행의 id는 음수 임시 id(-1, -2 …)다. 화면(PostsPage)은 번호 열에 숫자 대신 "신규"를 보여준다.
 * - 서버 행을 수정해 검색 조건을 벗어나면 그 행은 숨기지만, 총 건수에는 지금 보이는 페이지의 행만 반영된다.
 * - 수정해서 새로 검색어에 맞게 된 행은 서버 응답에 없으면 보이지 않는다.
 * - 서버 검색은 제목·본문을 보지만 여기서는 제목만 본다. 본문만 검색어에 맞는 삭제 행은 총 건수에서 빠지지 않는다.
 * - 서버 데이터가 바뀌어 다시 불러와도 확정 값(confirmed)이 계속 새 서버 값을 덮고, serverTitle은 처음 기억한 값에 머문다.
 *   DummyJSON은 데이터가 바뀌지 않아 지금은 드러나지 않는다. 실서버로 바꿀 때 이 층을 걷어내거나
 *   mergePosts에서 현재 서버 행으로 serverTitle을 갱신하는 방안을 검토한다.
 * ========================== */

import type { PostInput, PostRow } from '../../api/posts';

import { normalizeSearch } from './postsConfig';

/**
 * 수정 내용. 바꿀 수 있는 필드는 title, tags뿐이다.
 */
export type PostPatch = Partial<PostInput>;

/**
 * 수정·삭제할 행 (화면에 보이는 id와 제목)
 */
export type PostRef = Pick<PostRow, 'id' | 'title'>;

const EDITABLE_KEYS = ['title', 'tags'] as const satisfies readonly (keyof PostInput)[];

/**
 * 대기 중인 수정 요청
 */
export interface PendingEdit {
    requestId: number;
    patch: PostPatch;
}

/**
 * 확정된 필드 값과 그 값을 확정한 요청 번호
 */
export type ConfirmedPatch = {
    [K in keyof PostInput]?: { value: PostInput[K]; requestId: number };
};

/**
 * 서버 행 하나의 수정 상태
 */
export interface PostEdit {
    /**
     * 서버 원본 제목 (처음 수정할 때 기억한다. 삭제 스냅샷·총 건수 계산에 쓴다)
     */
    serverTitle: string;

    /**
     * 성공한 요청으로 확정된 값
     */
    confirmed: ConfirmedPatch;

    /**
     * 아직 응답을 기다리는 요청 (보낸 순서)
     */
    pending: readonly PendingEdit[];
}

/**
 * 삭제한 서버 행의 스냅샷
 * 다른 페이지로 옮겨도 총 건수를 맞추려고 서버 원본 제목을 같이 기억한다. (검색 조건 비교용)
 */
export interface DeletedPost {
    id: number;

    /**
     * 서버 원본 제목 (수정한 제목이 아니다)
     */
    title: string;

    /**
     * 이 삭제를 맡은 요청 번호
     */
    requestId: number;

    /**
     * 삭제 요청이 성공했는지 (false면 응답 대기 중)
     */
    confirmed: boolean;
}

export interface PostsOverlay {
    /**
     * 내가 추가한 행 (최근에 추가한 것이 앞)
     */
    added: readonly PostRow[];

    /**
     * 서버 행의 수정 상태 (id별)
     */
    edited: Readonly<Record<number, PostEdit>>;

    /**
     * 삭제한 서버 행 (id별 스냅샷, 대기 중인 삭제 포함)
     */
    deleted: Readonly<Record<number, DeletedPost>>;
}

export const initialPostsOverlay: PostsOverlay = {
    added: [],
    edited: {},
    deleted: {},
};

/**
 * 내가 추가한 행인지 (서버에 없는 임시 id)
 * 이런 행은 수정·삭제할 때 서버에 요청하지 않는다.
 */
export function isLocalPostId(id: number) {
    return id < 0;
}

/**
 * 제목이 검색어에 맞는지 (대소문자 무시, 빈 검색어는 모두 맞음)
 */
export function matchesSearch(title: string, q: string) {
    const keyword = normalizeSearch(q).toLowerCase();

    return keyword === '' || title.toLowerCase().includes(keyword);
}

/**
 * patch에서 바꿀 수 있는 필드(title, tags)만 남긴다.
 * 타입 밖의 값이 들어와도(likes 등) 변경분에 섞이지 않게 한다.
 */
function pickPatch(patch: PostPatch): PostPatch {
    const picked: PostPatch = {};
    if (patch.title !== undefined) picked.title = patch.title;
    if (patch.tags !== undefined) picked.tags = patch.tags;

    return picked;
}

function withoutKey<T>(record: Readonly<Record<number, T>>, id: number) {
    const next = { ...record };
    delete next[id];

    return next;
}

/**
 * 수정 상태 → 화면에 덮어쓸 값
 * 필드마다 요청 번호가 가장 큰 값을 쓴다. (확정·대기 구분 없이 가장 나중에 보낸 요청이 이긴다)
 */
export function editedPatch(edit: PostEdit | undefined): PostPatch {
    const patch: PostPatch = {};
    if (!edit) return patch;

    const latest: Partial<Record<keyof PostInput, number>> = {};
    const apply = (key: keyof PostInput, value: unknown, requestId: number) => {
        if ((latest[key] ?? -Infinity) > requestId) return;

        latest[key] = requestId;
        Object.assign(patch, { [key]: value });
    };

    for (const key of EDITABLE_KEYS) {
        const confirmed = edit.confirmed[key];
        if (confirmed) apply(key, confirmed.value, confirmed.requestId);
    }

    for (const { requestId, patch: pendingPatch } of edit.pending) {
        for (const key of EDITABLE_KEYS) {
            if (pendingPatch[key] !== undefined) apply(key, pendingPatch[key], requestId);
        }
    }

    return patch;
}

/* ==========================
 * 변경분을 바꾸는 함수
 * ========================== */

/**
 * 행 추가 (목록 맨 앞)
 * 같은 id가 이미 있으면 그대로 둔다.
 */
export function addRow(overlay: PostsOverlay, row: PostRow): PostsOverlay {
    if (overlay.added.some((added) => added.id === row.id)) return overlay;

    return { ...overlay, added: [row, ...overlay.added] };
}

/**
 * 행 수정
 * - 추가한 행: 그 행을 바로 고친다. (서버 요청이 없으므로 requestId는 쓰지 않는다)
 * - 서버 행: 대기 요청 목록에 넣는다. 처음 수정하면 row.title을 서버 원본 제목으로 기억한다.
 *   (목록에 없는 id여도 오류 없이 기록만 한다)
 * - 없는 임시 id, 빈 patch, 이미 넣은 requestId: 그대로 둔다.
 */
export function editRow(
    overlay: PostsOverlay,
    row: PostRef,
    patch: PostPatch,
    requestId: number,
): PostsOverlay {
    const picked = pickPatch(patch);
    if (Object.keys(picked).length === 0) return overlay;

    if (isLocalPostId(row.id)) {
        if (!overlay.added.some((added) => added.id === row.id)) return overlay;

        return {
            ...overlay,
            added: overlay.added.map((added) => (added.id === row.id ? { ...added, ...picked } : added)),
        };
    }

    const edit = overlay.edited[row.id] ?? { serverTitle: row.title, confirmed: {}, pending: [] };
    if (edit.pending.some((pending) => pending.requestId === requestId)) return overlay;

    return {
        ...overlay,
        edited: {
            ...overlay.edited,
            [row.id]: { ...edit, pending: [...edit.pending, { requestId, patch: picked }] },
        },
    };
}

/**
 * 수정 요청 성공: 대기 목록에서 확정으로 옮긴다.
 * 더 나중 요청이 이미 확정한 필드는 덮지 않는다. (응답이 보낸 순서와 다르게 와도 마지막 의도가 남는다)
 */
export function confirmEdit(overlay: PostsOverlay, id: number, requestId: number): PostsOverlay {
    const edit = overlay.edited[id];
    const done = edit?.pending.find((pending) => pending.requestId === requestId);
    if (!edit || !done) return overlay;

    const confirmed: ConfirmedPatch = { ...edit.confirmed };
    for (const key of EDITABLE_KEYS) {
        const value = done.patch[key];
        const current = confirmed[key];
        if (value === undefined || (current && current.requestId > requestId)) continue;

        Object.assign(confirmed, { [key]: { value, requestId } });
    }

    return {
        ...overlay,
        edited: {
            ...overlay.edited,
            [id]: {
                ...edit,
                confirmed,
                pending: edit.pending.filter((pending) => pending.requestId !== requestId),
            },
        },
    };
}

/**
 * 수정 요청 실패: 그 요청만 대기 목록에서 뺀다.
 * 확정 값도 대기 요청도 남지 않으면 수정 기록을 지운다.
 */
export function discardEdit(overlay: PostsOverlay, id: number, requestId: number): PostsOverlay {
    const edit = overlay.edited[id];
    if (!edit || !edit.pending.some((pending) => pending.requestId === requestId)) return overlay;

    const pending = edit.pending.filter((item) => item.requestId !== requestId);
    const isEmpty = pending.length === 0 && Object.keys(edit.confirmed).length === 0;

    return {
        ...overlay,
        edited: isEmpty
            ? withoutKey(overlay.edited, id)
            : { ...overlay.edited, [id]: { ...edit, pending } },
    };
}

/**
 * 행 삭제
 * - 추가한 행: 목록에서 뺀다. (서버에 없으므로 삭제 기록은 남기지 않는다)
 * - 서버 행: 스냅샷(id, 서버 원본 제목)을 이 요청 번호로 삭제 목록에 넣는다.
 *   수정 기록은 지우지 않는다. (삭제가 실패해 되살릴 때 수정한 값으로 돌아오게)
 * - 이미 삭제 중이거나 삭제한 행, 없는 임시 id: 그대로 둔다.
 */
export function removeRow(overlay: PostsOverlay, row: PostRef, requestId: number): PostsOverlay {
    if (isLocalPostId(row.id)) {
        if (!overlay.added.some((added) => added.id === row.id)) return overlay;

        return { ...overlay, added: overlay.added.filter((added) => added.id !== row.id) };
    }

    if (overlay.deleted[row.id]) return overlay;

    const title = overlay.edited[row.id]?.serverTitle ?? row.title;

    return {
        ...overlay,
        deleted: {
            ...overlay.deleted,
            [row.id]: { id: row.id, title, requestId, confirmed: false },
        },
    };
}

/**
 * 여러 행 삭제 (한 요청 번호로)
 */
export function removeRows(
    overlay: PostsOverlay,
    rows: readonly PostRef[],
    requestId: number,
): PostsOverlay {
    return rows.reduce((next, row) => removeRow(next, row, requestId), overlay);
}

/**
 * 이 요청이 맡아 응답을 기다리는 삭제 id
 */
export function pendingDeleteIds(overlay: PostsOverlay, requestId: number) {
    return Object.values(overlay.deleted)
        .filter((deleted) => deleted.requestId === requestId && !deleted.confirmed)
        .map((deleted) => deleted.id);
}

/**
 * 삭제 요청 성공: 확정한다. (다른 요청이 맡은 삭제는 건드리지 않는다)
 */
export function confirmDelete(overlay: PostsOverlay, id: number, requestId: number): PostsOverlay {
    const deleted = overlay.deleted[id];
    if (!deleted || deleted.requestId !== requestId || deleted.confirmed) return overlay;

    return { ...overlay, deleted: { ...overlay.deleted, [id]: { ...deleted, confirmed: true } } };
}

/**
 * 삭제 요청 실패: 삭제 목록에서 빼 행을 되살린다. (다른 요청이 맡은 삭제는 건드리지 않는다)
 */
export function discardDelete(overlay: PostsOverlay, id: number, requestId: number): PostsOverlay {
    const deleted = overlay.deleted[id];
    if (!deleted || deleted.requestId !== requestId || deleted.confirmed) return overlay;

    return { ...overlay, deleted: withoutKey(overlay.deleted, id) };
}

/* ==========================
 * 합치기
 * ========================== */

export interface MergePostsParams {
    /**
     * 서버가 준 이번 페이지 행
     */
    rows: readonly PostRow[];

    /**
     * 서버가 준 총 건수 (검색 중이면 검색 결과 건수)
     */
    total: number;

    /**
     * 내 변경분
     */
    overlay: PostsOverlay;

    /**
     * 지금 목록의 검색어
     */
    q: string;

    /**
     * 지금 목록의 페이지 (추가한 행은 1페이지에만 보인다)
     */
    page: number;
}

export interface MergedPosts {
    /**
     * 화면에 보일 행
     */
    rows: PostRow[];

    /**
     * 화면에 보일 총 건수
     */
    total: number;
}

/**
 * 서버 원본 + 변경분 → 화면에 보일 행과 총 건수
 * - 삭제한 행(대기 중 포함)은 숨긴다.
 * - 수정한 행은 덮어쓴다. 검색 중에 수정으로 조건을 벗어나면 숨긴다.
 * - 추가한 행은 1페이지 맨 앞에 붙인다. 검색 중이면 조건에 맞는 것만 붙인다.
 *
 * 총 건수 = 서버 total + 검색 조건에 맞는 추가 행 수 − 서버 원본 제목이 검색 조건에 맞는 삭제 행 수
 *          − 이번 페이지에서 수정으로 조건을 벗어나 숨긴 행 수
 * 삭제는 스냅샷으로 세므로 어느 페이지에서 봐도 같다.
 * 수정으로 숨긴 행은 이번 페이지 것만 셀 수 있다. (다른 페이지로 가면 다시 서버 total 기준이 된다)
 */
export function mergePosts({ rows, total, overlay, q, page }: MergePostsParams): MergedPosts {
    let hiddenByEdit = 0;
    const serverRows: PostRow[] = [];

    for (const row of rows) {
        if (overlay.deleted[row.id]) continue;

        const patch = editedPatch(overlay.edited[row.id]);
        if (Object.keys(patch).length === 0) {
            serverRows.push(row);
            continue;
        }

        const edited = { ...row, ...patch };
        if (matchesSearch(edited.title, q)) {
            serverRows.push(edited);
        } else {
            hiddenByEdit += 1;
        }
    }

    const addedRows = overlay.added.filter((row) => matchesSearch(row.title, q));
    const deletedCount = Object.values(overlay.deleted)
        .filter((deleted) => matchesSearch(deleted.title, q))
        .length;

    return {
        rows: page === 1 ? [...addedRows, ...serverRows] : serverRows,
        total: Math.max(0, total + addedRows.length - deletedCount - hiddenByEdit),
    };
}
