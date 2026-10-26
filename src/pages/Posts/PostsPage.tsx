import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { fetchPosts, toPostRow } from '../../api/posts';
import type { PostRow } from '../../api/posts';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import Loading from '../../components/Loading/Loading';
import { Pagination } from '../../components/Pagination';
import { Table } from '../../components/Table';
import type { TableColumn } from '../../components/Table';

/**
 * 한 페이지에 보여줄 게시글 수
 */
const PAGE_SIZE = 10;

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
                        <Badge>{tag}</Badge>
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

    const {
        data,
        isPending,
        isError,
        error,
        isPlaceholderData,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ['posts', { page, limit: PAGE_SIZE }],
        queryFn: ({ signal }) =>
            fetchPosts({
                limit: PAGE_SIZE,
                skip: (page - 1) * PAGE_SIZE,
                signal,
            }),
        // 페이지를 넘기는 동안 이전 목록을 그대로 보여준다. (깜빡임 방지)
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
        }),
    });

    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    /**
     * 요약 문구 "총 N건 · M페이지 중 K페이지"
     * ?page=999처럼 전체 페이지보다 큰 값이면 그 페이지가 없다고 알린다.
     */
    const summaryText = !data
        ? ''
        : data.shownPage > totalPages
            ? `총 ${total.toLocaleString()}건 · ${data.shownPage}페이지는 없습니다. (전체 ${totalPages}페이지)`
            : `총 ${total.toLocaleString()}건 · ${totalPages}페이지 중 ${data.shownPage}페이지`;

    /**
     * 페이지 이동
     * setSearchParams는 기본으로 history에 기록을 쌓으므로 뒤로가기가 동작한다.
     */
    const handlePageChange = (nextPage: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('page', String(nextPage));

            return next;
        });
    };

    return (
        <main className="ui-doc ui-posts">
            <h1 className="ui-doc__title">게시글 관리</h1>

            <p className="ui-posts__notice">
                데모 API: 변경은 화면에만 반영돼요
            </p>

            <section className="ui-doc__section" aria-labelledby="posts-list-title">
                <h2 id="posts-list-title" className="ui-doc__section-title">
                    게시글 목록
                </h2>

                {/* 페이지가 바뀔 때마다 스크린리더가 읽어준다 */}
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
                ) : (
                    <div
                        className="ui-posts__table-area"
                        aria-busy={isPlaceholderData}
                    >
                        <Table<PostRow>
                            columns={columns}
                            data={data?.rows ?? []}
                            loading={isPending}
                            emptyMessage="게시글이 없습니다."
                        />

                        {/* 페이지 이동 중: 이전 목록 위에 로딩을 덮는다 */}
                        {isPlaceholderData && (
                            <Loading
                                size="sm"
                                message="다음 페이지를 불러오는 중입니다."
                                description=""
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
        </main>
    );
}

export default PostsPage;
