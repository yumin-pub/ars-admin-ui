import Loading from '../../components/Loading/Loading';

function LoadingPage() {
    return (
        <main className="ui-doc">
            <h1 className="ui-doc__title">Loading</h1>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    0. HTML Loading Class
                </h2>

                <div className="ui-doc__group">
                    <div
                        className="ui-loading ui-loading--md"
                        role="status"
                        aria-live="polite"
                        aria-busy="true"
                    >
                        <div className="ui-loading__panel">
                            <span
                                className="ui-loading__spinner"
                                aria-hidden="true"
                            />

                            <div className="ui-loading__content">
                                <p className="ui-loading__message">
                                    데이터를 불러오는 중입니다.
                                </p>

                                <p className="ui-loading__description">
                                    잠시만 기다려 주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    1. Basic Loading
                </h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Medium
                    </h3>

                    <Loading
                        overlay={false}
                        size="md"
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Small
                    </h3>

                    <Loading
                        overlay={false}
                        size="sm"
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Large
                    </h3>

                    <Loading
                        overlay={false}
                        size="lg"
                    />
                </div>
            </section>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    2. Spinner Only
                </h2>

                <div className="ui-doc__group">
                    <Loading
                        overlay={false}
                        size="md"
                        message=""
                        description={null}
                    />
                </div>
            </section>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    3. Custom Message
                </h2>

                <div className="ui-doc__group">
                    <Loading
                        overlay={false}
                        size="md"
                        message="데이터를 저장하는 중입니다."
                        description="잠시만 기다려 주세요."
                    />
                </div>

                <div className="ui-doc__group">
                    <Loading
                        overlay={false}
                        size="md"
                        message="검색 결과를 불러오는 중입니다."
                        description="잠시만 기다려 주세요."
                    />
                </div>
            </section>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    3-1. No Description
                </h2>

                <div className="ui-doc__group">
                    <Loading
                        overlay={false}
                        size="sm"
                        message="다음 페이지를 불러오는 중입니다."
                        description={null}
                    />
                </div>
            </section>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    4. Overlay Loading
                </h2>

                <div className="ui-doc__group">
                    <div className="loading-demo">
                        <div
                            className="loading-demo__content"
                            aria-hidden="true"
                        >
                            <div className="loading-demo__title" />

                            <div className="loading-demo__cards">
                                <div className="loading-demo__card" />
                                <div className="loading-demo__card" />
                                <div className="loading-demo__card" />
                            </div>

                            <div className="loading-demo__table" />
                        </div>

                        <Loading
                            overlay
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default LoadingPage;