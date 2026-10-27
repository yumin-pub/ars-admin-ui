/* ==========================
 * 게시글 변경분 훅
 *
 * 변경분(postsOverlay)과 추가·수정·삭제 요청(postsMutations)을 화면에서 쓰기 좋게 묶는다.
 * 서버 목록은 지금처럼 useQuery로 받고, 화면에 그리기 전에 merge로 변경분을 합친다.
 * 변경분은 이 훅을 쓰는 컴포넌트에 있다. (컴포넌트가 사라지면 변경분도 사라진다)
 * ========================== */

import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useMutation } from '@tanstack/react-query';

import type { PostInput, PostRow } from '../../api/posts';

import { createPostsMutationOptions, createPostsOverlayStore } from './postsMutations';
import { mergePosts } from './postsOverlay';
import type { MergedPosts, PostPatch, PostRef } from './postsOverlay';

export interface MergeServerPostsParams {
    /**
     * 서버가 준 이번 페이지 행 (toPostRow로 바꾼 것)
     */
    rows: readonly PostRow[];

    /**
     * 서버가 준 총 건수
     */
    total: number;

    /**
     * 지금 목록의 검색어
     */
    q: string;

    /**
     * 지금 목록의 페이지
     */
    page: number;
}

/**
 * @example
 * const { merge, addPost, editPost, removePosts, error, clearError } = usePostsOverlay();
 * const { rows, total } = merge({ rows: data.rows, total: data.total, q, page });
 * editPost(row, { title: '새 제목' });   // row는 화면에 보이는 행
 * // error는 PostsErrorAlert(항상 DOM에 있는 role="alert")로 보여준다.
 */
export function usePostsOverlay() {
    const [store] = useState(() => createPostsOverlayStore());
    const { overlay, error } = useSyncExternalStore(store.subscribe, store.getState);
    const options = useMemo(() => createPostsMutationOptions(store), [store]);

    const addMutation = useMutation(options.add);
    const editMutation = useMutation(options.edit);
    const removeMutation = useMutation(options.remove);

    const merge = useCallback(
        (params: MergeServerPostsParams): MergedPosts => mergePosts({ ...params, overlay }),
        [overlay],
    );

    // 실패는 onError에서 롤백하고 errorMessage로 알리므로, 여기서는 Promise를 돌려주지 않는다.
    const { mutate: add } = addMutation;
    const { mutate: edit } = editMutation;
    const { mutate: remove } = removeMutation;

    const addPost = useCallback((post: PostInput) => add(post), [add]);
    const editPost = useCallback(
        (row: PostRef, patch: PostPatch) => edit({ requestId: store.createRequestId(), row, patch }),
        [edit, store],
    );
    const removePosts = useCallback(
        (rows: readonly PostRef[]) => remove({ requestId: store.createRequestId(), rows }),
        [remove, store],
    );
    const clearError = useCallback(() => store.clearError(), [store]);
    const reportError = useCallback((message: string) => store.reportError(message), [store]);

    return {
        overlay,
        merge,
        addPost,
        editPost,
        removePosts,

        /**
         * 마지막으로 실패한 요청의 오류 ({ message, version }). 화면에서는 role="alert"로 보여준다.
         * 같은 문구여도 version이 바뀌므로 다시 알릴 수 있다.
         * 새 변경을 시작해도 지워지지 않고 clearError(닫기 버튼)로만 지워진다.
         */
        error,
        clearError,

        /**
         * 화면에서 직접 오류를 알린다. (예: 수정하려던 행이 그 사이 사라진 경우)
         */
        reportError,

        /**
         * 종류별 마지막 요청이 진행 중인지 (useMutation의 isPending)
         */
        isMutating: addMutation.isPending || editMutation.isPending || removeMutation.isPending,
    };
}
