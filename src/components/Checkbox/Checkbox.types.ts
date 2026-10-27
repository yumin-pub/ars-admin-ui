import type {
    InputHTMLAttributes,
    ReactNode,
    Ref,
} from 'react';
export interface CheckboxProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode;
    children?: ReactNode;
    structure?: 'wrap' | 'detached';

    /**
     * input 요소 ref (선택, React 19에서는 ref가 일반 prop이다)
     * 예: 일부 선택 상태는 HTML 속성이 아니라 DOM 속성이라 ref로 input.indeterminate = true를 준다.
     */
    ref?: Ref<HTMLInputElement>;

    /**
     * ui-radio 추가 클래스
     */
    className?: string;
}