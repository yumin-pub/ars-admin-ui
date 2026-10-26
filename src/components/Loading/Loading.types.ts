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
     *
     * 지정하지 않으면(undefined) 기본 문구를 표시하고,
     * null을 넘기면 보조 문구를 표시하지 않습니다.
     */
    description?: string | null;

    /**
     * 추가 클래스명입니다.
     */
    className?: string;
}