import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MutationObserver, onlineManager, QueryClient } from '@tanstack/react-query';

import type { PostInput, PostRow } from '../../api/posts';

import {
    createPostsMutationOptions,
    createPostsOverlayStore,
    toPostErrorMessage,
} from './postsMutations';
import { addRow, confirmDelete, initialPostsOverlay, mergePosts, removeRow, removeRows } from './postsOverlay';
import type { PostPatch, PostRef, PostsOverlay } from './postsOverlay';

/* ==========================
 * fetch 모의
 * 요청은 응답을 줄 때까지 대기한다. 테스트가 응답 순서와 성공·실패를 정한다.
 * ========================== */

interface PendingRequest {
    url: string;
    method: string;
    body: unknown;
    respond: (status: number, body?: unknown) => void;

    /**
     * 네트워크 오류 (fetch는 이때 TypeError를 던진다)
     */
    failNetwork: () => void;
}

let requests: PendingRequest[];

beforeEach(() => {
    requests = [];
    vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
            requests.push({
                url,
                method: init?.method ?? 'GET',
                body: init?.body ? JSON.parse(String(init.body)) : undefined,
                respond: (status, body = {}) =>
                    resolve(new Response(JSON.stringify(body), { status })),
                failNetwork: () => reject(new TypeError('Failed to fetch')),
            });
        }),
    ));
});

afterEach(() => {
    vi.unstubAllGlobals();
});

/**
 * 대기 중인 요청이 count개가 될 때까지 기다린다. (onMutate는 비동기로 실행된다)
 */
async function waitForRequests(count: number) {
    await vi.waitFor(() => expect(requests).toHaveLength(count));
}

/* ==========================
 * 준비
 * ========================== */

function row(id: number, title = `post ${id}`): PostRow {
    return { id, title, tags: ['tag'], likes: id, views: id * 10 };
}

const serverRows = [row(1, 'first'), row(2, 'second'), row(3, 'third')];

function setup(initialOverlay?: PostsOverlay) {
    const client = new QueryClient();
    const store = createPostsOverlayStore(initialOverlay);
    const options = createPostsMutationOptions(store);

    // 실패한 요청의 오류는 store.error로 확인하므로 여기서는 삼킨다.
    const ignore = () => undefined;

    return {
        store,
        options,
        // usePostsOverlay와 같은 방식으로 요청 번호를 붙인다
        add: (post: PostInput) =>
            new MutationObserver(client, options.add).mutate(post).catch(ignore),
        edit: (target: PostRef, patch: PostPatch) =>
            new MutationObserver(client, options.edit)
                .mutate({ requestId: store.createRequestId(), row: target, patch })
                .catch(ignore),
        remove: (rows: readonly PostRef[]) =>
            new MutationObserver(client, options.remove)
                .mutate({ requestId: store.createRequestId(), rows })
                .catch(ignore),

        /**
         * 지금 화면에 보일 행과 총 건수
         */
        visible: () =>
            mergePosts({ rows: serverRows, total: 3, overlay: store.getState().overlay, q: '', page: 1 }),

        /**
         * 지금 화면에 보일 id 목록
         */
        visibleIds: () =>
            mergePosts({ rows: serverRows, total: 3, overlay: store.getState().overlay, q: '', page: 1 })
                .rows.map((r) => r.id),
    };
}

/* ==========================
 * 테스트
 * ========================== */

describe('낙관적 업데이트', () => {
    it('응답을 받기 전에 화면에 먼저 반영하고, 요청을 보낸다', async () => {
        const { edit, visible } = setup();

        const done = edit(serverRows[0], { title: 'changed' });
        await waitForRequests(1);

        expect(visible().rows[0].title).toBe('changed');
        expect(requests[0]).toMatchObject({
            url: 'https://dummyjson.com/posts/1',
            method: 'PUT',
            body: { title: 'changed' },
        });

        requests[0].respond(200, { id: 1 });
        await done;
        expect(visible().rows[0].title).toBe('changed');
    });
});

describe('롤백', () => {
    it('서버 행 수정이 실패하면 원래 값으로 돌아오고 오류 메시지를 노출한다', async () => {
        const { edit, store, visible } = setup();

        const done = edit(serverRows[1], { title: 'changed', tags: ['x'] });
        await waitForRequests(1);
        expect(visible().rows[1]).toMatchObject({ title: 'changed', tags: ['x'] });

        requests[0].respond(500);
        await done;

        expect(visible().rows[1]).toEqual(row(2, 'second'));
        expect(store.getState().overlay.edited).toEqual({});
        expect(store.getState().error?.message).toBe("'second' 게시글 수정에 실패했습니다. (오류 코드 500)");
    });

    it('삭제 요청이 실패하면 행이 다시 나타난다', async () => {
        const { remove, store, visible, visibleIds } = setup();

        const done = remove([serverRows[0]]);
        await waitForRequests(1);
        expect(visibleIds()).toEqual([2, 3]);
        expect(visible().total).toBe(2);
        expect(requests[0]).toMatchObject({ url: 'https://dummyjson.com/posts/1', method: 'DELETE' });

        requests[0].respond(404);
        await done;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(visible().total).toBe(3);
        expect(store.getState().error?.message).toBe("'first' 게시글 삭제에 실패했습니다. (오류 코드 404)");
    });

    it('추가 요청이 실패하면 추가한 행이 사라진다', async () => {
        const { add, store, visibleIds } = setup();

        const done = add({ title: 'new', tags: [] });
        await waitForRequests(1);
        expect(visibleIds()[0]).toBe(-1);
        expect(requests[0]).toMatchObject({ method: 'POST', body: { title: 'new', tags: [], userId: 1 } });

        requests[0].respond(500);
        await done;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().error?.message).toBe("'new' 게시글 추가에 실패했습니다. (오류 코드 500)");
    });

    it('추가 요청 중에 그 행을 고쳤어도, 추가가 실패하면 행이 사라진다 (수정 요청 없음)', async () => {
        const { add, edit, visibleIds } = setup();

        const done = add({ title: 'new', tags: [] });
        await waitForRequests(1);
        await edit({ id: -1, title: 'new' }, { title: 'renamed' });

        requests[0].respond(500);
        await done;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(requests).toHaveLength(1);
    });

    it('여러 행 삭제 중 일부만 실패하면 실패한 행만 되살리고, 실패한 건수로 알린다 (1건이어도 건수)', async () => {
        const { remove, store, visible, visibleIds } = setup();

        const done = remove([serverRows[0], serverRows[1]]);
        await waitForRequests(2);
        requests[0].respond(200);
        requests[1].respond(500);
        await done;

        expect(visibleIds()).toEqual([2, 3]);
        expect(visible().total).toBe(2);
        expect(store.getState().overlay.deleted[1].confirmed).toBe(true);
        expect(store.getState().error?.message).toBe('게시글 1건 삭제에 실패했습니다. (오류 코드 500)');
    });

    it('여러 행이 모두 실패하면 건수로 알린다', async () => {
        const { remove, store, visibleIds } = setup();

        const done = remove([serverRows[0], serverRows[1]]);
        await waitForRequests(2);
        requests[0].failNetwork();
        requests[1].failNetwork();
        await done;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().error?.message).toBe('게시글 2건 삭제에 실패했습니다. 네트워크 연결을 확인해 주세요.');
    });
});

describe('같은 id를 수정한 뒤 삭제', () => {
    it('둘 다 성공하면 행이 숨겨진다', async () => {
        const { edit, remove, visible, visibleIds } = setup();

        const edited = edit(serverRows[1], { title: 'changed' });
        await waitForRequests(1);
        requests[0].respond(200);
        await edited;

        const removed = remove([{ id: 2, title: 'changed' }]);
        await waitForRequests(2);
        requests[1].respond(200);
        await removed;

        expect(visibleIds()).toEqual([1, 3]);
        expect(visible().total).toBe(2);
    });

    it('삭제가 실패하면 수정한 값으로 다시 나타난다', async () => {
        const { edit, remove, visible } = setup();

        const edited = edit(serverRows[1], { title: 'changed' });
        await waitForRequests(1);
        requests[0].respond(200);
        await edited;

        const removed = remove([{ id: 2, title: 'changed' }]);
        await waitForRequests(2);
        requests[1].respond(500);
        await removed;

        expect(visible().rows[1]).toMatchObject({ id: 2, title: 'changed' });
    });

    it('삭제 스냅샷에는 화면 제목이 아니라 서버 원본 제목이 들어간다', async () => {
        const { edit, remove, store } = setup();

        const edited = edit(serverRows[1], { title: 'changed' });
        await waitForRequests(1);
        requests[0].respond(200);
        await edited;

        const removed = remove([{ id: 2, title: 'changed' }]);
        await waitForRequests(2);
        requests[1].respond(200);
        await removed;

        expect(store.getState().overlay.deleted[2]).toMatchObject({ title: 'second', confirmed: true });

        // 원래 제목으로 검색: 서버 total(1)에 2번이 들어 있었으므로 빠진다
        const overlay = store.getState().overlay;
        expect(mergePosts({ rows: [], total: 1, overlay, q: 'second', page: 1 }).total).toBe(0);
        // 고친 제목으로 검색: 서버 결과(1건)에 2번은 없었으므로 빼지 않는다
        expect(mergePosts({ rows: [row(9, 'changed later')], total: 1, overlay, q: 'changed', page: 1 }).total)
            .toBe(1);
    });
});

describe('추가한 행 (서버에 없는 id)', () => {
    it('수정·삭제는 서버 요청 없이 변경분만 바꾼다', async () => {
        const { add, edit, remove, store, visible, visibleIds } = setup();

        const added = add({ title: 'new', tags: [] });
        await waitForRequests(1);
        requests[0].respond(200, { id: 252 });
        await added;

        // 응답 id(252)가 아니라 임시 id(-1)로 남는다
        expect(visibleIds()[0]).toBe(-1);

        await edit({ id: -1, title: 'new' }, { title: 'renamed' });
        expect(visible().rows[0]).toMatchObject({ id: -1, title: 'renamed' });

        await remove([{ id: -1, title: 'renamed' }]);
        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().overlay.deleted).toEqual({});

        // 추가 요청 하나만 나갔다
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().error).toBeNull();
    });

    it('임시 id는 다시 쓰지 않는다 (먼저 추가한 행의 실패가 나중 행을 지우지 않음)', async () => {
        const { add, remove, visible } = setup();

        const first = add({ title: 'first new', tags: [] });
        await waitForRequests(1);
        await remove([{ id: -1, title: 'first new' }]);

        const second = add({ title: 'second new', tags: [] });
        await waitForRequests(2);

        requests[0].respond(500);
        await first;

        expect(visible().rows[0]).toMatchObject({ id: -2, title: 'second new' });

        requests[1].respond(200);
        await second;
    });

    it('초기 변경분에 임시 id가 있으면 그보다 작은 id부터 쓴다', async () => {
        const initial = addRow(addRow(initialPostsOverlay, row(-1, 'old a')), row(-3, 'old b'));
        const { add, store } = setup(initial);

        const done = add({ title: 'new', tags: [] });
        await waitForRequests(1);

        expect(store.getState().overlay.added.map((r) => r.id)).toEqual([-4, -3, -1]);

        requests[0].respond(200);
        await done;
    });
});

describe('연속 수정 (A: title a, B: title b를 차례로 보냄)', () => {
    async function sendAB() {
        const ctx = setup();
        const a = ctx.edit(serverRows[0], { title: 'a' });
        await waitForRequests(1);
        const b = ctx.edit({ id: 1, title: 'a' }, { title: 'b' });
        await waitForRequests(2);

        // 대기 중에는 나중 요청 값
        expect(ctx.visible().rows[0].title).toBe('b');

        return { ...ctx, a, b };
    }

    it('A 실패 → B 실패: 원래 값', async () => {
        const { a, b, visible } = await sendAB();
        requests[0].respond(500);
        await a;
        expect(visible().rows[0].title).toBe('b');
        requests[1].respond(500);
        await b;

        expect(visible().rows[0].title).toBe('first');
    });

    it('B 실패 → A 실패: 원래 값', async () => {
        const { a, b, visible } = await sendAB();
        requests[1].respond(500);
        await b;
        expect(visible().rows[0].title).toBe('a');
        requests[0].respond(500);
        await a;

        expect(visible().rows[0].title).toBe('first');
    });

    it('A 성공 → B 실패: A 값', async () => {
        const { a, b, visible } = await sendAB();
        requests[0].respond(200);
        await a;
        requests[1].respond(500);
        await b;

        expect(visible().rows[0].title).toBe('a');
    });

    it('A 실패 → B 성공: B 값', async () => {
        const { a, b, visible } = await sendAB();
        requests[0].respond(500);
        await a;
        requests[1].respond(200);
        await b;

        expect(visible().rows[0].title).toBe('b');
    });

    it('B 성공 → A 성공 (응답이 거꾸로 옴): B 값', async () => {
        const { a, b, visible } = await sendAB();
        requests[1].respond(200);
        await b;
        requests[0].respond(200);
        await a;

        expect(visible().rows[0].title).toBe('b');
    });

    it('같은 값으로 두 번 수정하고 첫 번째가 실패해도 두 번째 대기 요청은 남는다', async () => {
        const { edit, visible, store } = setup();

        const first = edit(serverRows[0], { title: 'x' });
        await waitForRequests(1);
        const second = edit({ id: 1, title: 'x' }, { title: 'x' });
        await waitForRequests(2);

        requests[0].respond(500);
        await first;
        expect(visible().rows[0].title).toBe('x');
        expect(store.getState().overlay.edited[1].pending).toHaveLength(1);

        requests[1].respond(200);
        await second;
        expect(visible().rows[0].title).toBe('x');
    });

    it('첫 번째 삭제가 실패해도 다른 행의 두 번째 삭제는 되돌리지 않는다', async () => {
        const { remove, visibleIds } = setup();

        const first = remove([serverRows[0]]);
        await waitForRequests(1);
        const second = remove([serverRows[1]]);
        await waitForRequests(2);

        requests[0].respond(500);
        await first;
        expect(visibleIds()).toEqual([1, 3]);

        requests[1].respond(200);
        await second;
        expect(visibleIds()).toEqual([1, 3]);
    });
});

describe('중복 삭제', () => {
    it('삭제 요청이 끝나기 전에 같은 행을 다시 삭제하면 요청을 다시 보내지 않는다 (첫 요청 실패 → 되살아남)', async () => {
        const { remove, store, visibleIds } = setup();

        const first = remove([serverRows[0]]);
        await waitForRequests(1);
        const second = remove([serverRows[0]]);
        await second;

        // 두 번째는 요청 없이 끝난다
        expect(requests).toHaveLength(1);
        expect(visibleIds()).toEqual([2, 3]);

        requests[0].respond(500);
        await first;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().error?.message).toBe("'first' 게시글 삭제에 실패했습니다. (오류 코드 500)");
    });

    it('삭제 요청이 끝나기 전에 같은 행을 다시 삭제하고 첫 요청이 성공하면 삭제된 채 남는다', async () => {
        const { remove, store, visibleIds } = setup();

        const first = remove([serverRows[0]]);
        await waitForRequests(1);
        await remove([serverRows[0]]);

        requests[0].respond(200);
        await first;

        expect(requests).toHaveLength(1);
        expect(visibleIds()).toEqual([2, 3]);
        expect(store.getState().overlay.deleted[1].confirmed).toBe(true);
    });

    it('이미 삭제된 행을 다시 삭제해도 요청 없이 그대로다', async () => {
        const { remove, store, visibleIds } = setup();

        const first = remove([serverRows[0]]);
        await waitForRequests(1);
        requests[0].respond(200);
        await first;

        await remove([serverRows[0]]);

        expect(requests).toHaveLength(1);
        expect(visibleIds()).toEqual([2, 3]);
        expect(store.getState().error).toBeNull();
    });
});

describe('없는 id', () => {
    it('없는 임시 id를 수정·삭제하면 요청 없이 아무 일도 일어나지 않는다', async () => {
        const { edit, remove, store } = setup();
        const before = store.getState().overlay;

        await edit({ id: -99, title: 'x' }, { title: 'y' });
        await remove([{ id: -99, title: 'x' }]);

        expect(fetch).not.toHaveBeenCalled();
        expect(store.getState().overlay).toBe(before);
        expect(store.getState().error).toBeNull();
    });

    it('목록에 없는 서버 id 수정이 실패해도 오류 없이 되돌린다', async () => {
        const { edit, store, visible } = setup();

        const done = edit({ id: 999, title: 'ghost' }, { title: 'x' });
        await waitForRequests(1);
        requests[0].respond(404);
        await done;

        expect(store.getState().overlay.edited).toEqual({});
        expect(visible().rows).toEqual(serverRows);
    });
});

describe('오류 메시지', () => {
    it('네트워크 오류는 브라우저 메시지 대신 한국어 안내를 보여준다', async () => {
        const { edit, store } = setup();

        const done = edit(serverRows[0], { title: 'a' });
        await waitForRequests(1);
        requests[0].failNetwork();
        await done;

        expect(store.getState().error?.message).toBe("'first' 게시글 수정에 실패했습니다. 네트워크 연결을 확인해 주세요.");
        expect(store.getState().error?.message).not.toContain('Failed to fetch');
    });

    it('알 수 없는 오류는 영어 메시지를 노출하지 않는다', () => {
        expect(toPostErrorMessage('추가', "'a' 게시글", new Error('Unexpected token')))
            .toBe("'a' 게시글 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    });

    it('새 변경을 시작해도, 성공해도 이전 오류는 지우지 않고 clearError로만 지운다', async () => {
        const { edit, store } = setup();

        const failed = edit(serverRows[0], { title: 'a' });
        await waitForRequests(1);
        requests[0].respond(500);
        await failed;
        const error = store.getState().error;
        expect(error).not.toBeNull();

        const next = edit(serverRows[0], { title: 'b' });
        await waitForRequests(2);
        expect(store.getState().error).toBe(error);

        requests[1].respond(200);
        await next;
        expect(store.getState().error).toBe(error);

        store.clearError();
        expect(store.getState().error).toBeNull();
    });

    it('같은 문구가 연달아 나와도 version이 올라 새 알림이 된다', async () => {
        const { edit, store } = setup();

        const first = edit(serverRows[0], { title: 'a' });
        await waitForRequests(1);
        requests[0].respond(500);
        await first;
        const firstError = store.getState().error;

        const second = edit(serverRows[0], { title: 'a' });
        await waitForRequests(2);
        requests[1].respond(500);
        await second;
        const secondError = store.getState().error;

        expect(secondError?.message).toBe(firstError?.message);
        expect(secondError?.version).toBe((firstError?.version ?? 0) + 1);
    });

    it('구독자에게 변경을 알린다', async () => {
        const { edit, store } = setup();
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);

        const done = edit(serverRows[0], { title: 'a' });
        await waitForRequests(1);
        expect(listener).toHaveBeenCalled();

        unsubscribe();
        listener.mockClear();
        requests[0].respond(500);
        await done;
        expect(listener).not.toHaveBeenCalled();
    });
});

describe('보강', () => {
    describe('필드가 일부만 겹치는 연속 수정 (A: title+tags, B: title), 응답이 거꾸로 옴', () => {
        async function sendAB() {
            const ctx = setup();
            const a = ctx.edit(serverRows[0], { title: 'a', tags: ['a'] });
            await waitForRequests(1);
            const b = ctx.edit({ id: 1, title: 'a' }, { title: 'b' });
            await waitForRequests(2);

            return { ...ctx, a, b };
        }

        it('B 성공 → A 성공: title은 B, tags는 A', async () => {
            const { a, b, visible } = await sendAB();
            requests[1].respond(200);
            await b;
            requests[0].respond(200);
            await a;

            expect(visible().rows[0]).toMatchObject({ title: 'b', tags: ['a'] });
        });

        it('B 성공 → A 실패: title은 B, tags는 원래 값', async () => {
            const { a, b, visible } = await sendAB();
            requests[1].respond(200);
            await b;
            requests[0].respond(500);
            await a;

            expect(visible().rows[0]).toMatchObject({ title: 'b', tags: ['tag'] });
        });
    });

    it('수정이 대기 중인 행을 삭제했다가 삭제가 실패하면 대기 중인 수정 값으로 되살아난다', async () => {
        const { edit, remove, store, visible, visibleIds } = setup();

        const edited = edit(serverRows[1], { title: 'changed' });
        await waitForRequests(1);
        const removed = remove([{ id: 2, title: 'changed' }]);
        await waitForRequests(2);

        expect(visibleIds()).toEqual([1, 3]);
        expect(store.getState().overlay.deleted[2].title).toBe('second');

        requests[1].respond(500);
        await removed;
        expect(visible().rows[1]).toMatchObject({ id: 2, title: 'changed' });

        requests[0].respond(200);
        await edited;
        expect(visible().rows[1]).toMatchObject({ id: 2, title: 'changed' });
    });

    it('삭제 오류가 실패한 id 목록을 담지 않으면, 이 요청이 맡은 삭제만 모두 되살리고 그 건수로 알린다', () => {
        const { options, store, visibleIds } = setup();

        // 3번은 다른 요청(1번)이 이미 삭제를 확정했다
        store.updateOverlay((overlay) => removeRow(overlay, serverRows[2], 1));
        store.updateOverlay((overlay) => confirmDelete(overlay, 3, 1));
        // 1·2번은 이번 요청(2번)이 맡았다
        const rows = [serverRows[0], serverRows[1], serverRows[2]];
        store.updateOverlay((overlay) => removeRows(overlay, rows, 2));
        expect(visibleIds()).toEqual([]);

        options.remove.onError?.(new Error('boom'), { requestId: 2, rows }, undefined, {} as never);

        expect(visibleIds()).toEqual([1, 2]);
        expect(store.getState().overlay.deleted[3].confirmed).toBe(true);
        expect(store.getState().error?.message).toBe('게시글 2건 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    });

    it('같은 id가 중복된 목록을 삭제하다 실패하면 1건으로 알린다', async () => {
        const { remove, store, visibleIds } = setup();

        const done = remove([serverRows[0], serverRows[0]]);
        await waitForRequests(1);
        requests[0].respond(500);
        await done;

        expect(requests).toHaveLength(1);
        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().error?.message).toBe("'first' 게시글 삭제에 실패했습니다. (오류 코드 500)");
    });
});

/**
 * 브라우저가 오프라인일 때 (onlineManager로 흉내)
 * networkMode 기본값('online')이면 요청이 멈춰 waitForRequests에서 실패한다.
 * POSTS_REQUEST_OPTIONS(networkMode: 'always')가 있어야 요청을 보내 실패하고 롤백된다.
 */
describe('오프라인', () => {
    beforeEach(() => onlineManager.setOnline(false));
    afterEach(() => onlineManager.setOnline(true));

    it('수정: 요청을 보내 실패시키고, 롤백 + 네트워크 안내', async () => {
        const { edit, store, visible } = setup();

        const done = edit(serverRows[0], { title: 'offline' });
        await waitForRequests(1);
        expect(visible().rows[0].title).toBe('offline');

        requests[0].failNetwork();
        await done;

        expect(visible().rows[0].title).toBe('first');
        expect(store.getState().error?.message).toBe("'first' 게시글 수정에 실패했습니다. 네트워크 연결을 확인해 주세요.");
    });

    it('추가: 요청을 보내 실패시키고, 추가한 행을 지운다', async () => {
        const { add, store, visibleIds } = setup();

        const done = add({ title: 'new', tags: [] });
        await waitForRequests(1);
        requests[0].failNetwork();
        await done;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().error?.message).toBe("'new' 게시글 추가에 실패했습니다. 네트워크 연결을 확인해 주세요.");
    });

    it('삭제: 요청을 보내 실패시키고, 행을 되살린다', async () => {
        const { remove, store, visibleIds } = setup();

        const done = remove([serverRows[0]]);
        await waitForRequests(1);
        requests[0].failNetwork();
        await done;

        expect(visibleIds()).toEqual([1, 2, 3]);
        expect(store.getState().error?.message).toBe("'first' 게시글 삭제에 실패했습니다. 네트워크 연결을 확인해 주세요.");
    });
});
