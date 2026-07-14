export type PaginationAlign =
    | 'left'
    | 'center'
    | 'right';

export interface PaginationProps {
    /**
     * 현재 페이지
     */
    page: number;

    /**
     * 전체 페이지 수
     */
    totalPages: number;

    /**
     * 페이지 변경 시 실행할 함수
     */
    onPageChange: (page: number) => void;

    /**
     * 한 번에 표시할 페이지 버튼 개수
     */
    visiblePageCount?: number; // 숫자는 받는데, 돌려주는 것은 없음

    /**
     * 정렬
     */
    align?: PaginationAlign;

    /**
     * 추가 클래스
     */
    className?: string;
}