import { Badge } from '../../components/Badge';

function BadgePage() {
    return (
        <main className="ui-doc">
            <h1 className="ui-doc__title">Badge</h1>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">1. HTML Badge Class</h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Variant</h3>

                    <div className="ui-doc__row">
                        <span className="ui-badge ui-badge--success">노출중</span>
                        <span className="ui-badge ui-badge--warning">예약</span>
                        <span className="ui-badge ui-badge--neutral">미노출</span>
                    </div>
                </div>
            </section>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">2. React Badge Component</h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Variant</h3>

                    <div className="ui-doc__row">
                        <Badge variant="success">노출중</Badge>
                        <Badge variant="warning">예약</Badge>
                        <Badge variant="neutral">미노출</Badge>
                    </div>
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Default (neutral)</h3>

                    <div className="ui-doc__row">
                        <Badge>대기</Badge>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default BadgePage;
