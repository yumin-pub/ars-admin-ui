import { Link } from 'react-router-dom';

/**
 * 없는 경로 (라우터의 '*')
 * 새 스타일 없이 데모 공통 레이아웃(ui-doc)과 Button의 HTML 클래스를 쓴다.
 * "목록으로 돌아가기"는 페이지 이동이라 <button>이 아니라 링크(<a>)로 두고, 모양만 Button과 같게 한다.
 * Link의 to는 라우터 basename 기준이라 하위 경로(/ars-admin-ui/demo/)에서도 맞는 주소가 된다.
 */
function NotFound() {
    return (
        <main className="ui-doc">
            <h1 className="ui-doc__title">페이지를 찾을 수 없습니다</h1>

            <section className="ui-doc__section">
                <p>주소가 바뀌었거나 없는 페이지입니다.</p>

                <Link to="/ui/posts" className="ui-btn ui-btn--outline ui-btn--neutral ui-btn--md">
                    목록으로 돌아가기
                </Link>
            </section>
        </main>
    );
}

export default NotFound;
