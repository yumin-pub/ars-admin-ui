import type { PaginationProps } from './Pagination.types';

function Pagination({
    page,
    totalPages,
    onPageChange,
    visiblePageCount = 5,
    align = 'center',
    className = '',
}: PaginationProps) {
    /**
     * 현재 페이지가 첫 페이지인지 확인
     */
    const isFirstPage = page <= 1;

    /**
     * 현재 페이지가 마지막 페이지인지 확인
     */
    const isLastPage = page >= totalPages;

    /**
     * 현재 페이지를 가운데에 배치하기 위해
     * 페이지 버튼 개수의 절반을 계산
     *
     * visiblePageCount = 5
     * Math.floor(5 / 2) = 2
     */
    const half = Math.floor(visiblePageCount / 2);

    /**
     * 화면에 표시할 첫 페이지와 마지막 페이지 계산
     */
    let startPage = page - half;
    let endPage = startPage + visiblePageCount - 1;

    /**
     * 첫 페이지 범위를 벗어난 경우 보정
     *
     * 예:
     * -1, 0, 1, 2, 3
     * ↓
     * 1, 2, 3, 4, 5
     */
    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(visiblePageCount, totalPages);
    }

    /**
     * 마지막 페이지 범위를 벗어난 경우 보정
     *
     * 예:
     * 8, 9, 10, 11, 12
     * ↓
     * 6, 7, 8, 9, 10
     */
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(
            1,
            endPage - visiblePageCount + 1
        );
    }

    /**
     * startPage부터 endPage까지의 페이지 번호 배열 생성
     *
     * startPage = 6
     * endPage = 10
     *
     * 결과:
     * [6, 7, 8, 9, 10]
     */
    const pageNumbers = Array.from(
        {
            length: endPage - startPage + 1,
        },
        (_, index) => startPage + index
    );

    /**
     * Pagination 정렬 클래스 생성
     */
    const paginationClassNameList = [
        'ui-pagination',
        `ui-pagination--${align}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav
            className={paginationClassNameList}
            aria-label="페이지네이션"
        >
            <ul className="ui-pagination__list">
                <li className="ui-pagination__item">
                    <button
                        type="button"
                        className="ui-pagination__button"
                        aria-label="첫 페이지"
                        disabled={isFirstPage}
                        onClick={() => onPageChange(1)}
                    >
                        «
                    </button>
                </li>

                <li className="ui-pagination__item">
                    <button
                        type="button"
                        className="ui-pagination__button"
                        aria-label="이전 페이지"
                        disabled={isFirstPage}
                        onClick={() => onPageChange(page - 1)}
                    >
                        ‹
                    </button>
                </li>

                {pageNumbers.map((pageNumber) => {
                    const isActive = pageNumber === page;

                    return (
                        <li
                            key={pageNumber}
                            className="ui-pagination__item"
                        >
                            <button
                                type="button"
                                className={[
                                    'ui-pagination__button',
                                    isActive && 'is-active',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                aria-current={
                                    isActive
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() =>
                                    onPageChange(pageNumber)
                                }
                            >
                                {pageNumber}
                            </button>
                        </li>
                    );
                })}

                <li className="ui-pagination__item">
                    <button
                        type="button"
                        className="ui-pagination__button"
                        aria-label="다음 페이지"
                        disabled={isLastPage}
                        onClick={() => onPageChange(page + 1)}
                    >
                        ›
                    </button>
                </li>

                <li className="ui-pagination__item">
                    <button
                        type="button"
                        className="ui-pagination__button"
                        aria-label="마지막 페이지"
                        disabled={isLastPage}
                        onClick={() => onPageChange(totalPages)}
                    >
                        »
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;