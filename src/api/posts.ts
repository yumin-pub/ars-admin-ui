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
    signal,
}: FetchPostsParams): Promise<PostsResponse> {
    const params = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
    });

    const response = await fetch(`${POSTS_API_URL}?${params}`, { signal });

    if (!response.ok) {
        throw new Error(`게시글 목록을 불러오지 못했습니다. (HTTP ${response.status})`);
    }

    return response.json() as Promise<PostsResponse>;
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
