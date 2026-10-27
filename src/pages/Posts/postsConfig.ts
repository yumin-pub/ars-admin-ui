/* ==========================
 * 게시글 화면 공용 규칙
 * PostsPage(목록·검색)와 postsOverlay(변경분 합치기)가 같은 규칙을 쓰도록 한곳에 둔다.
 * ========================== */

/**
 * 한 페이지에 보여줄 게시글 수
 */
export const POSTS_PAGE_SIZE = 10;

/**
 * 게시글 화면의 react-query 요청 공통 옵션 (목록 useQuery, 추가·수정·삭제 useMutation 모두)
 *
 * networkMode 기본값('online')은 브라우저가 오프라인이면 요청을 시작하지 않고 멈춰 둔다.
 * 그러면 낙관적으로 바꾼 값이 실패도 성공도 없이 화면에 남고(롤백·오류 알림 없음),
 * 다시 온라인이 되는 순간 사용자가 모르게 요청이 나간다. 목록도 오류 없이 이전 화면에 머문다.
 * 'always'로 두면 오프라인에서도 요청을 보내 바로 실패하므로, 롤백과 "네트워크 연결을 확인해 주세요" 안내가 동작한다.
 * 전역 기본값(main.tsx의 QueryClient)은 바꾸지 않고 이 화면에만 적용한다.
 */
export const POSTS_REQUEST_OPTIONS = {
    networkMode: 'always',
} as const;

/**
 * 검색어 정규화: 앞뒤 공백을 지운다. (공백만 있으면 빈 검색어)
 * URL의 ?q=, 서버 요청, 변경분의 검색 조건 비교가 모두 이 값을 기준으로 한다.
 */
export function normalizeSearch(q: string | null | undefined) {
    return (q ?? '').trim();
}
