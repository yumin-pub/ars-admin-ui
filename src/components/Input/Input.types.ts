import type {
    InputHTMLAttributes,
    ReactNode,
} from 'react';

// Input 스타일 종류
export type InputVariant =
    | 'outline'
    | 'underline'
    | 'ghost';

// Input 크기
export type InputSize =
    | 'md'
    | 'lg';

// Label 배치
export type InputLayout =
    | 'column'
    | 'row';

// Input 상태
export type InputState =
    | 'default'
    | 'error'
    | 'success';

/**
 * Input Props
 *
 * extends InputHTMLAttributes<HTMLInputElement>
 * = React 기본 input 속성 상속
 *
 * ReactNode
 * = 문자, 태그, 컴포넌트 모두 가능
 * ?: 의미 : 있어도 되고 없어도 된다
 */
export interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {

    // Label
    label?: ReactNode;

    // Helper Message
    helperText?: ReactNode;

    // Counter
    counter?: ReactNode;

    // Variant
    variant?: InputVariant;

    // Size
    InputSize?: InputSize;

    // LayoutX
    layout?: InputLayout;

    // State
    state?: InputState;

    // Input 앞 영역
    prefixContent?: ReactNode;

    // Input 뒤 영역
    suffixContent?: ReactNode;

    // Clear Button 표시 여부
    clearable?: boolean;

    // ui-field 추가 클래스, fieldClassName이라 하고 컴포넌트에 클래스 추가하면 됨  
    fieldClassName?: string;

    // ui-input 추가 클래스
    inputClassName?: string;
}