import type {
    InputHTMLAttributes,
    ReactNode,
    Ref,
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
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {

    // Label
    label?: ReactNode;

    // Helper Message
    helperText?: ReactNode;

    // Helper Message 요소의 id (선택)
    // 지정하면 helperText 요소에 id가 붙고 input의 aria-describedby에 연결된다.
    // (넘긴 aria-describedby가 있으면 그 뒤에 잇는다) 지정하지 않으면 기존 DOM과 같다.
    helperTextId?: string;

    // input 요소 ref (선택, React 19에서는 ref가 일반 prop이다)
    // 예: 값을 지운 뒤 입력창으로 포커스를 돌려줄 때
    ref?: Ref<HTMLInputElement>;

    // Counter
    counter?: ReactNode;

    // Variant
    variant?: InputVariant;

    // Size
    size?: InputSize;

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

    // Clear Button 클릭 시 호출 (clearable일 때만 의미가 있다)
    // 값을 비우는 일은 호출하는 쪽이 한다. (controlled input 기준)
    onClear?: () => void;

    // ui-field 추가 클래스, fieldClassName이라 하고 컴포넌트에 클래스 추가하면 됨  
    fieldClassName?: string;

    // ui-input 추가 클래스
    inputClassName?: string;
}