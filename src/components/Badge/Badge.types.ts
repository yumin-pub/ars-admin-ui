import type {
    HTMLAttributes,
    ReactNode,
} from 'react';

export type BadgeVariant =
    | 'success'
    | 'warning'
    | 'neutral'
    | 'tag';

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
     *
     * 'tag'는 상태가 아닌 분류(태그)용으로, 점 없이 테두리가 있는 사각형으로 표시한다.
     */
    variant?: BadgeVariant;

    /**
     * 추가 클래스
     */
    className?: string;
}
