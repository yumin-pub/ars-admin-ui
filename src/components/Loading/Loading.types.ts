export type LoadingSize = 'sm' | 'md' | 'lg';

export interface LoadingProps {
    /**
     * 로딩 영역 전체를 dimmed overlay로 표시합니다.
     */
    overlay?: boolean;

    /**
     * Loading spinner 크기입니다.
     */
    size?: LoadingSize;

    /**
     * Loading 기본 안내 문구입니다.
     */
    message?: string;

    /**
     * Loading 보조 안내 문구입니다.
     */
    description?: string;

    /**
     * 추가 클래스명입니다.
     */
    className?: string;
}