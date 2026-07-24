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
     * 1페이지가 표시 범위(startPage~endPage)에 포함되지 않았는지 확인
     * 포함 안 됐으면 맨 앞에 1페이지 바로가기 버튼을 따로 보여준다
     */
    const showFirstPageShortcut = startPage > 1;

    /**
     * 1페이지 바로가기와 표시 범위 사이에 숫자가 비어있는지 확인
     * 비어있으면 그 사이를 "..."으로 생략 표시한다
     *
     * 예: startPage = 8 이면 1과 8 사이(2~7)가 비므로 "..." 표시
     *     startPage = 2 이면 1과 2가 붙어있으므로 "..." 없이 바로 이어짐
     */
    const showLeadingEllipsis = startPage > 2;

    /**
     * 마지막 페이지가 표시 범위에 포함되지 않았는지 확인
     * 포함 안 됐으면 맨 뒤에 마지막 페이지 바로가기 버튼을 따로 보여준다
     */
    const showLastPageShortcut = endPage < totalPages;

    /**
     * 표시 범위와 마지막 페이지 바로가기 사이에 숫자가 비어있는지 확인
     */
    const showTrailingEllipsis = endPage < totalPages - 1;

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

                {/* 1페이지가 현재 표시 범위 밖에 있을 때만 1페이지 바로가기 노출 */}
                {showFirstPageShortcut && (
                    <li className="ui-pagination__item">
                        <button
                            type="button"
                            className="ui-pagination__button"
                            aria-label="1페이지로 이동"
                            onClick={() => onPageChange(1)}
                        >
                            1
                        </button>
                    </li>
                )}

                {/* 1페이지와 표시 범위 사이에 숫자가 비어있을 때만 "..." 노출 */}
                {showLeadingEllipsis && (
                    <li
                        className="ui-pagination__item ui-pagination__ellipsis"
                        aria-hidden="true"
                    >
                        <span className="ui-pagination__ellipsis-text">
                            …
                        </span>
                    </li>
                )}

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
                                disabled={isActive}
                                onClick={() =>
                                    onPageChange(pageNumber)
                                }
                            >
                                {pageNumber}
                            </button>
                        </li>
                    );
                })}

                {/* 표시 범위와 마지막 페이지 사이에 숫자가 비어있을 때만 "..." 노출 */}
                {showTrailingEllipsis && (
                    <li
                        className="ui-pagination__item ui-pagination__ellipsis"
                        aria-hidden="true"
                    >
                        <span className="ui-pagination__ellipsis-text">
                            …
                        </span>
                    </li>
                )}

                {/* 마지막 페이지가 현재 표시 범위 밖에 있을 때만 마지막 페이지 바로가기 노출 */}
                {showLastPageShortcut && (
                    <li className="ui-pagination__item">
                        <button
                            type="button"
                            className="ui-pagination__button"
                            aria-label={`${totalPages}페이지로 이동`}
                            onClick={() => onPageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </li>
                )}

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