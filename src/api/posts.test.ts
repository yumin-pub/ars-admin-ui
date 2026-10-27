import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { createPost, deletePost, PostsHttpError, updatePost } from './posts';

let fetchMock: Mock<typeof fetch>;

function respondWith(status: number, body: unknown = {}) {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }));
}

beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('createPost', () => {
    it('POST /posts/add로 title, tags와 데모 userId를 보낸다', async () => {
        const signal = new AbortController().signal;
        respondWith(201, { id: 252, title: 'new' });

        await expect(createPost({ post: { title: 'new', tags: ['a'] }, signal }))
            .resolves.toEqual({ id: 252, title: 'new' });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://dummyjson.com/posts/add');
        expect(init).toMatchObject({ method: 'POST', signal });
        expect(JSON.parse(String(init?.body))).toEqual({ title: 'new', tags: ['a'], userId: 1 });
    });

    it('2xx가 아니면 오류를 던진다', async () => {
        respondWith(400);

        await expect(createPost({ post: { title: '', tags: [] } }))
            .rejects.toThrow('게시글을 추가하지 못했습니다. (HTTP 400)');
    });
});

describe('updatePost', () => {
    it('PUT /posts/{id}로 바꾼 필드만 보낸다', async () => {
        const signal = new AbortController().signal;
        respondWith(200, { id: 3, title: 'x' });

        await updatePost({ id: 3, patch: { title: 'x' }, signal });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://dummyjson.com/posts/3');
        expect(init).toMatchObject({ method: 'PUT', signal });
        expect(JSON.parse(String(init?.body))).toEqual({ title: 'x' });
    });

    it('2xx가 아니면 오류를 던진다', async () => {
        respondWith(404);

        await expect(updatePost({ id: 999, patch: { title: 'x' } }))
            .rejects.toThrow('게시글을 수정하지 못했습니다. (HTTP 404)');
    });
});

describe('deletePost', () => {
    it('DELETE /posts/{id}를 보낸다', async () => {
        const signal = new AbortController().signal;
        respondWith(200, { id: 3, isDeleted: true });

        await expect(deletePost({ id: 3, signal })).resolves.toMatchObject({ id: 3 });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://dummyjson.com/posts/3');
        expect(init).toMatchObject({ method: 'DELETE', signal });
    });

    it('2xx가 아니면 상태 코드를 담은 PostsHttpError를 던진다', async () => {
        respondWith(500);

        const error = await deletePost({ id: 3 }).catch((reason: unknown) => reason);
        expect(error).toBeInstanceOf(PostsHttpError);
        expect(error).toMatchObject({ status: 500, message: '게시글을 삭제하지 못했습니다. (HTTP 500)' });
    });

    it('취소되면 fetch의 AbortError를 그대로 던진다', async () => {
        const controller = new AbortController();
        fetchMock.mockImplementationOnce((_url, init) =>
            new Promise((_resolve, reject) => {
                init?.signal?.addEventListener('abort', () =>
                    reject(new DOMException('aborted', 'AbortError')),
                );
            }),
        );

        const request = deletePost({ id: 3, signal: controller.signal });
        controller.abort();

        await expect(request).rejects.toThrow('aborted');
    });
});
