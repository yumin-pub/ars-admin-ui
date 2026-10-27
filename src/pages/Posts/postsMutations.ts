/* ==========================
 * 게시글 추가·수정·삭제 (낙관적 업데이트 + 롤백)
 *
 * 요청을 보내기 전에 변경분을 먼저 반영하고(onMutate), 성공하면 확정하고(onSuccess),
 * 실패하면 그 요청 하나만 걷어낸다(onError).
 * 수정·삭제는 요청 번호(requestId)로 구분해, 어떤 요청이 실패해도 다른 요청의 변경은 남는다.
 * (규칙은 postsOverlay.ts 상단 주석 참고)
 *
 * React 밖에서도 쓸 수 있게 저장소와 useMutation 옵션을 만드는 함수로 나눴다.
 * (훅은 usePostsOverlay, 테스트는 react-query의 MutationObserver로 이 옵션을 직접 돌린다)
 * ========================== */

import type { MutationOptions } from '@tanstack/react-query';

import { createPost, deletePost, PostsHttpError, updatePost } from '../../api/posts';
import type { PostInput, PostMutationResponse } from '../../api/posts';

import {
    addRow,
    confirmDelete,
    confirmEdit,
    discardDelete,
    discardEdit,
    editRow,
    initialPostsOverlay,
    isLocalPostId,
    pendingDeleteIds,
    removeRow,
    removeRows,
} from './postsOverlay';
import type { PostPatch, PostRef, PostsOverlay } from './postsOverlay';
import { POSTS_REQUEST_OPTIONS } from './postsConfig';

/* ==========================
 * 저장소
 * ========================== */

export interface PostsOverlayState {
    /**
     * 내 변경분
     */
    overlay: PostsOverlay;

    /**
     * 마지막으로 실패한 요청의 오류 (화면에서는 role="alert"로 보여준다)
     * 새 변경을 시작해도 지우지 않는다. clearError로만 지운다.
     */
    error: PostsError | null;
}

export interface PostsError {
    /**
     * 사용자에게 보여줄 한국어 문구
     */
    message: string;

    /**
     * 알릴 때마다 1씩 오르는 번호
     * 같은 문구가 연달아 나와도 번호가 달라 화면이 다시 알릴 수 있다.
     */
    version: number;
}

export interface PostsOverlayStore {
    /**
     * 지금 상태 (바뀔 때마다 새 객체)
     */
    getState: () => PostsOverlayState;

    /**
     * 상태가 바뀌면 listener를 부른다. 돌려준 함수로 구독을 끊는다.
     */
    subscribe: (listener: () => void) => () => void;

    /**
     * 변경분을 바꾼다. update가 같은 객체를 돌려주면 알리지 않는다.
     */
    updateOverlay: (update: (overlay: PostsOverlay) => PostsOverlay) => void;

    /**
     * 오류를 알린다. 같은 문구여도 version을 올려 새 알림으로 만든다.
     */
    reportError: (message: string) => void;

    /**
     * 오류를 지운다. (화면의 닫기 버튼)
     */
    clearError: () => void;

    /**
     * 추가한 행에 붙일 임시 id (-1, -2 …)
     * 지운 id를 다시 쓰지 않아, 실패한 추가 요청의 롤백이 다른 행을 지우지 않는다.
     * 초기 변경분에 이미 있는 임시 id보다 작은 값부터 쓴다.
     */
    createLocalId: () => number;

    /**
     * 수정·삭제 요청 번호 (1, 2 …, 보낸 순서)
     */
    createRequestId: () => number;
}

export function createPostsOverlayStore(
    initialOverlay: PostsOverlay = initialPostsOverlay,
): PostsOverlayStore {
    let state: PostsOverlayState = { overlay: initialOverlay, error: null };
    let nextLocalId = Math.min(0, ...initialOverlay.added.map((row) => row.id)) - 1;
    let nextRequestId = 1;
    let errorVersion = 0;
    const listeners = new Set<() => void>();

    const setState = (next: PostsOverlayState) => {
        state = next;
        listeners.forEach((listener) => listener());
    };

    return {
        getState: () => state,
        subscribe: (listener) => {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
        updateOverlay: (update) => {
            const overlay = update(state.overlay);
            if (overlay !== state.overlay) setState({ ...state, overlay });
        },
        reportError: (message) => {
            errorVersion += 1;
            setState({ ...state, error: { message, version: errorVersion } });
        },
        clearError: () => {
            if (state.error) setState({ ...state, error: null });
        },
        createLocalId: () => nextLocalId--,
        createRequestId: () => nextRequestId++,
    };
}

/* ==========================
 * 사용자용 오류 메시지
 * ========================== */

type PostAction = '추가' | '수정' | '삭제';

/**
 * 실패한 작업과 대상을 담은 한국어 문구
 * - 네트워크 오류(fetch가 던지는 TypeError, 예: "Failed to fetch"): 연결 확인 안내
 * - HTTP 오류: 상태 코드
 * 브라우저·서버가 준 영어 메시지는 그대로 노출하지 않는다.
 *
 * 한계: TypeError는 모두 fetch의 네트워크 오류로 본다. 코드 버그로 난 TypeError도 연결 확인 안내가 된다.
 * 2xx 응답의 본문 파싱 실패(SyntaxError)는 "잠시 후 다시 시도"로 가며, 서버가 처리했어도 화면은 롤백된다.
 */
export function toPostErrorMessage(action: PostAction, target: string, error: unknown) {
    const base = `${target} ${action}에 실패했습니다.`;

    if (error instanceof PostsHttpError) return `${base} (오류 코드 ${error.status})`;
    if (error instanceof TypeError) return `${base} 네트워크 연결을 확인해 주세요.`;

    return `${base} 잠시 후 다시 시도해 주세요.`;
}

function postTarget(title: string) {
    return `'${title}' 게시글`;
}

/**
 * 삭제 실패 문구의 대상
 * - 1건만 삭제한 요청: 그 제목 ('제목' 게시글)
 * - 여러 건을 한꺼번에 삭제한 요청(일괄 삭제): 실패한 건수 (게시글 N건). 1건만 실패해도 건수로 알린다.
 * rows에 같은 id가 여러 번 들어 있어도 한 번만 센다.
 */
function deleteTarget(rows: readonly PostRef[], failedIds: readonly number[]) {
    const uniqueRows = [...new Map(rows.map((row) => [row.id, row])).values()];
    const failedCount = uniqueRows.filter((row) => failedIds.includes(row.id)).length;

    if (uniqueRows.length === 1) return postTarget(uniqueRows[0].title);
    if (failedCount === 0) return '게시글';

    return `게시글 ${failedCount}건`;
}

/* ==========================
 * useMutation 옵션
 * ========================== */

export interface EditPostVariables {
    /**
     * createRequestId()로 받은 요청 번호
     */
    requestId: number;

    /**
     * 수정할 행 (화면에 보이는 id와 제목)
     */
    row: PostRef;

    /**
     * 바꿀 필드 (title, tags)
     */
    patch: PostPatch;
}

export interface RemovePostsVariables {
    /**
     * createRequestId()로 받은 요청 번호
     */
    requestId: number;

    /**
     * 삭제할 행 (화면에 보이는 id와 제목)
     */
    rows: readonly PostRef[];
}

/**
 * 추가한 행(임시 id)을 다룰 때 넘기는 요청 번호
 * 추가한 행은 서버 요청이 없어 변경분 함수가 요청 번호를 쓰지 않는다. createRequestId()는 1부터라 겹치지 않는다.
 */
const LOCAL_REQUEST_ID = 0;

interface AddContext {
    id: number;
}

/**
 * 여러 행 삭제 중 일부가 실패했을 때의 오류 (실패한 id만 되살린다)
 */
export class DeletePostsError extends Error {
    failedIds: number[];
    cause: unknown;

    constructor(failedIds: number[], cause: unknown) {
        super('게시글을 삭제하지 못했습니다.');
        this.name = 'DeletePostsError';
        this.failedIds = failedIds;
        this.cause = cause;
    }
}

export interface PostsMutationOptions {
    add: MutationOptions<PostMutationResponse, Error, PostInput, AddContext>;
    edit: MutationOptions<PostMutationResponse | null, Error, EditPostVariables>;
    remove: MutationOptions<void, Error, RemovePostsVariables>;
}

export function createPostsMutationOptions(store: PostsOverlayStore): PostsMutationOptions {
    return {
        add: {
            ...POSTS_REQUEST_OPTIONS,
            onMutate: (post) => {
                const id = store.createLocalId();
                store.updateOverlay((overlay) =>
                    addRow(overlay, { id, title: post.title, tags: post.tags, likes: 0, views: 0 }),
                );

                return { id };
            },
            // 응답 id로 바꾸지 않고 임시 id를 그대로 쓴다. (DummyJSON은 매번 같은 id를 돌려준다)
            mutationFn: (post) => createPost({ post }),
            // 서버에 없는 행이므로 그 사이 화면에서 고친 내용과 함께 지운다.
            onError: (error, post, context) => {
                if (context) {
                    store.updateOverlay((overlay) =>
                        removeRow(overlay, { id: context.id, title: post.title }, LOCAL_REQUEST_ID),
                    );
                }
                store.reportError(toPostErrorMessage('추가', postTarget(post.title), error));
            },
        },

        edit: {
            ...POSTS_REQUEST_OPTIONS,
            onMutate: ({ requestId, row, patch }) => {
                store.updateOverlay((overlay) => editRow(overlay, row, patch, requestId));
            },
            // 추가한 행은 서버에 없으므로 요청하지 않는다.
            mutationFn: ({ row, patch }) =>
                isLocalPostId(row.id) ? Promise.resolve(null) : updatePost({ id: row.id, patch }),
            onSuccess: (_data, { requestId, row }) => {
                store.updateOverlay((overlay) => confirmEdit(overlay, row.id, requestId));
            },
            onError: (error, { requestId, row }) => {
                store.updateOverlay((overlay) => discardEdit(overlay, row.id, requestId));
                store.reportError(toPostErrorMessage('수정', postTarget(row.title), error));
            },
        },

        remove: {
            ...POSTS_REQUEST_OPTIONS,
            onMutate: ({ requestId, rows }) => {
                store.updateOverlay((overlay) => removeRows(overlay, rows, requestId));
            },
            // 이 요청이 맡은 삭제만 보낸다.
            // 추가한 행(위에서 목록에서 빠짐)과 이미 삭제 중이거나 삭제한 행은 다시 요청하지 않는다.
            // 일부만 실패하면 실패한 id만 되살린다.
            mutationFn: async ({ requestId }) => {
                const ids = pendingDeleteIds(store.getState().overlay, requestId);
                const results = await Promise.allSettled(ids.map((id) => deletePost({ id })));

                const failed = results.flatMap((result, index) =>
                    result.status === 'rejected' ? [{ id: ids[index], reason: result.reason }] : [],
                );
                if (failed.length > 0) {
                    throw new DeletePostsError(failed.map(({ id }) => id), failed[0].reason);
                }
            },
            onSuccess: (_data, { requestId }) => {
                store.updateOverlay((overlay) =>
                    pendingDeleteIds(overlay, requestId).reduce(
                        (next, id) => confirmDelete(next, id, requestId),
                        overlay,
                    ),
                );
            },
            // 실패한 id만 되살리고 나머지는 확정한다.
            // 실패한 id를 모르는 오류(DeletePostsError가 아님)면 이 요청이 맡은 삭제를 모두 되살린다.
            onError: (error, { requestId, rows }) => {
                const ownIds = pendingDeleteIds(store.getState().overlay, requestId);
                const failedIds = error instanceof DeletePostsError ? error.failedIds : ownIds;

                store.updateOverlay((overlay) =>
                    ownIds.reduce(
                        (next, id) => (failedIds.includes(id)
                            ? discardDelete(next, id, requestId)
                            : confirmDelete(next, id, requestId)),
                        overlay,
                    ),
                );

                const cause = error instanceof DeletePostsError ? error.cause : error;
                store.reportError(toPostErrorMessage('삭제', deleteTarget(rows, failedIds), cause));
            },
        },
    };
}
