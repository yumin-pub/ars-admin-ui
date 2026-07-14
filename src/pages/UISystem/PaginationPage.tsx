import { useState } from 'react';

import { Pagination } from '../../components/Pagination';
function PaginationPage() {
    const [currentPage, setCurrentPage] = useState(3);
    return (
        <main className="ui-doc">
            <h1 className="ui-doc__title">
                Pagination
            </h1>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    1. HTML Pagination Class
                </h2>

                {/* 기본 상태 */}
                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Default
                    </h3>

                    <nav
                        className="ui-pagination"
                        aria-label="페이지네이션"
                    >
                        <ul className="ui-pagination__list">
                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="첫 페이지"
                                >
                                    «
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="이전 페이지"
                                >
                                    ‹
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    1
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button is-active"
                                    aria-current="page"
                                >
                                    2
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    3
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    4
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    5
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="다음 페이지"
                                >
                                    ›
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="마지막 페이지"
                                >
                                    »
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* 첫 페이지 */}
                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        First Page
                    </h3>

                    <nav
                        className="ui-pagination"
                        aria-label="첫 페이지 예시"
                    >
                        <ul className="ui-pagination__list">
                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="첫 페이지"
                                    disabled
                                >
                                    «
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="이전 페이지"
                                    disabled
                                >
                                    ‹
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button is-active"
                                    aria-current="page"
                                >
                                    1
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    2
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    3
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    4
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    5
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="다음 페이지"
                                >
                                    ›
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="마지막 페이지"
                                >
                                    »
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* 마지막 페이지 */}
                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Last Page
                    </h3>

                    <nav
                        className="ui-pagination"
                        aria-label="마지막 페이지 예시"
                    >
                        <ul className="ui-pagination__list">
                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="첫 페이지"
                                >
                                    «
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="이전 페이지"
                                >
                                    ‹
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    6
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    7
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    8
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    9
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button is-active"
                                    aria-current="page"
                                >
                                    10
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="다음 페이지"
                                    disabled
                                >
                                    ›
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                    aria-label="마지막 페이지"
                                    disabled
                                >
                                    »
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* 정렬 */}
                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Layout
                    </h3>

                    <nav
                        className="ui-pagination ui-pagination--left"
                        aria-label="왼쪽 정렬 페이지네이션"
                    >
                        <ul className="ui-pagination__list">
                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button is-active"
                                    aria-current="page"
                                >
                                    1
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    2
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    3
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <nav
                        className="ui-pagination ui-pagination--right"
                        aria-label="오른쪽 정렬 페이지네이션"
                    >
                        <ul className="ui-pagination__list">
                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button is-active"
                                    aria-current="page"
                                >
                                    1
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    2
                                </button>
                            </li>

                            <li className="ui-pagination__item">
                                <button
                                    type="button"
                                    className="ui-pagination__button"
                                >
                                    3
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    2. React Pagination Component
                </h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Default
                    </h3>

                    <Pagination
                        page={currentPage}
                        totalPages={10}
                        visiblePageCount={5}
                        onPageChange={setCurrentPage}
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Left Align
                    </h3>

                    <Pagination
                        page={currentPage}
                        totalPages={10}
                        visiblePageCount={5}
                        align="left"
                        onPageChange={setCurrentPage}
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Right Align
                    </h3>

                    <Pagination
                        page={currentPage}
                        totalPages={10}
                        visiblePageCount={5}
                        align="right"
                        onPageChange={setCurrentPage}
                    />
                </div>
            </section>
        </main>
    );
}

export default PaginationPage;