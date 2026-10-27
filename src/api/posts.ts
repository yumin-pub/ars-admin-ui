/* ==========================
 * DummyJSON Posts API
 * https://dummyjson.com/docs/posts
 *
 * 데모 API라서 추가·수정·삭제 요청은 서버에 저장되지 않는다.
 * ========================== */

const POSTS_API_URL = 'https://dummyjson.com/posts';

/**
 * 서버 응답의 게시글 한 건 (서버가 주는 모양 그대로)
 */
export interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
    views: number;
    userId: number;
}

/**
 * 게시글 목록 응답
 */
export interface PostsResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}

export interface FetchPostsParams {
    /**
     * 한 번에 가져올 개수
     */
    limit: number;

    /**
     * 건너뛸 개수 ((page - 1) * limit)
     */
    skip: number;

    /**
     * 검색어. 값이 있으면 /posts/search를 쓰고, 없으면 기존 목록 조회와 같다.
     * 앞뒤 공백은 여기서도 한 번 더 제거한다. (공백만 있으면 검색하지 않는다)
     */
    q?: string;

    /**
     * 요청 취소용 (react-query가 넘겨주는 signal)
     */
    signal?: AbortSignal;
}

/**
 * 게시글 목록 조회
 * 응답 코드가 2xx가 아니면 오류를 던진다. (fetch는 4xx·5xx에서 스스로 실패하지 않는다)
 */
export async function fetchPosts({
    limit,
    skip,
    q,
    signal,
}: FetchPostsParams): Promise<PostsResponse> {
    const keyword = q?.trim() ?? '';

    const params = new URLSearchParams({
        ...(keyword && { q: keyword }),
        limit: String(limit),
        skip: String(skip),
    });

    const url = keyword
        ? `${POSTS_API_URL}/search?${params}`
        : `${POSTS_API_URL}?${params}`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`게시글 목록을 불러오지 못했습니다. (HTTP ${response.status})`);
    }

    return response.json() as Promise<PostsResponse>;
}

/* ==========================
 * 추가·수정·삭제
 * 응답 코드가 2xx가 아니면 오류를 던진다. (fetchPosts와 같다)
 * DummyJSON은 응답만 돌려주고 저장하지 않는다.
 * ========================== */

/**
 * 추가·수정할 수 있는 필드 (likes, views는 서버 값이라 바꾸지 않는다)
 */
export interface PostInput {
    title: string;
    tags: string[];
}

/**
 * 추가·수정·삭제 응답
 * 요청에 따라 일부 필드만 오므로 id 외에는 있을 수도, 없을 수도 있다.
 */
export type PostMutationResponse = Pick<Post, 'id'> & Partial<Post>;

/**
 * 데모 API가 추가 요청에 요구하는 작성자 id
 */
const DEMO_USER_ID = 1;

/**
 * 2xx가 아닌 응답의 오류. 화면에서 상태 코드로 문구를 고를 수 있게 status를 담는다.
 * (네트워크 오류는 fetch가 던지는 TypeError가 그대로 올라간다)
 */
export class PostsHttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'PostsHttpError';
        this.status = status;
    }
}

export interface CreatePostParams {
    /**
     * 추가할 내용 (title, tags)
     */
    post: PostInput;

    /**
     * 요청 취소용
     */
    signal?: AbortSignal;
}

/**
 * 게시글 추가
 */
export async function createPost({
    post,
    signal,
}: CreatePostParams): Promise<PostMutationResponse> {
    const response = await fetch(`${POSTS_API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, userId: DEMO_USER_ID }),
        signal,
    });

    if (!response.ok) {
        throw new PostsHttpError(
            `게시글을 추가하지 못했습니다. (HTTP ${response.status})`,
            response.status,
        );
    }

    return response.json() as Promise<PostMutationResponse>;
}

export interface UpdatePostParams {
    /**
     * 수정할 게시글 id
     */
    id: number;

    /**
     * 바꿀 필드만 담는다. (title, tags)
     */
    patch: Partial<PostInput>;

    /**
     * 요청 취소용
     */
    signal?: AbortSignal;
}

/**
 * 게시글 수정 (보낸 필드만 바뀐다)
 */
export async function updatePost({
    id,
    patch,
    signal,
}: UpdatePostParams): Promise<PostMutationResponse> {
    const response = await fetch(`${POSTS_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
        signal,
    });

    if (!response.ok) {
        throw new PostsHttpError(
            `게시글을 수정하지 못했습니다. (HTTP ${response.status})`,
            response.status,
        );
    }

    return response.json() as Promise<PostMutationResponse>;
}

export interface DeletePostParams {
    /**
     * 삭제할 게시글 id
     */
    id: number;

    /**
     * 요청 취소용
     */
    signal?: AbortSignal;
}

/**
 * 게시글 삭제
 */
export async function deletePost({
    id,
    signal,
}: DeletePostParams): Promise<PostMutationResponse> {
    const response = await fetch(`${POSTS_API_URL}/${id}`, {
        method: 'DELETE',
        signal,
    });

    if (!response.ok) {
        throw new PostsHttpError(
            `게시글을 삭제하지 못했습니다. (HTTP ${response.status})`,
            response.status,
        );
    }

    return response.json() as Promise<PostMutationResponse>;
}

/* ==========================
 * 화면용 데이터
 * 화면 코드는 서버 모양(Post) 대신 이 모양(PostRow)만 쓴다.
 * 서버 응답이 바뀌면 이 변환 함수만 고치면 된다.
 * ========================== */

export interface PostRow {
    id: number;
    title: string;
    tags: string[];
    likes: number;
    views: number;
}

export function toPostRow(post: Post): PostRow {
    return {
        id: post.id,
        title: post.title,
        tags: post.tags,
        likes: post.reactions.likes,
        views: post.views,
    };
}
