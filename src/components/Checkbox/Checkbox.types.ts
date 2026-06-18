import type {
    InputHTMLAttributes,
    ReactNode,
} from 'react';
export interface CheckboxProps
    extends InputHTMLAttributes<HTMLInputElement> { 
    label?: ReactNode;
    children?: ReactNode;
    structure?: 'wrap' | 'detached';

    /**
     * ui-radio 추가 클래스
     */
    className?: string;
}