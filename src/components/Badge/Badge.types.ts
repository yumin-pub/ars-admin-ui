import type {
    HTMLAttributes,
    ReactNode,
} from 'react';

export type BadgeVariant =
    | 'success'
    | 'warning'
    | 'neutral';

export interface BadgeProps
    extends HTMLAttributes<HTMLSpanElement> {
    /**
     * 표시할 상태 텍스트
     *
     * 점(dot)은 장식이므로 상태 의미는 반드시 텍스트로 전달한다.
     */
    children: ReactNode;

    /**
     * 상태 색상
     */
    variant?: BadgeVariant;

    /**
     * 추가 클래스
     */
    className?: string;
}
