import type {
    ButtonHTMLAttributes,
    ReactNode,
} from 'react';

export type ButtonVariant =
    | 'solid'
    | 'outline'
    | 'icon'
    | 'box';

export type ButtonColor =
    | 'primary'
    | 'secondary'
    | 'neutral';

export type ButtonSize =
    | 'lg'
    | 'md';

export interface ButtonProps // ButtonProps라는 규칙집을 만들겠다., Button 컴포넌트가 받을 수 있는 옵션 목록을 정의하겠다.
    extends ButtonHTMLAttributes<HTMLButtonElement> { //근데 내가 처음부터 만들지는 않을 거야. React가 원래 가지고 있는 button 설명서를 먼저 가져다 쓰겠다.
        // 리액트 창고에 ButtonHTMLAttributes 라는 설명서가 있음 
        // 그 설명서를 복사해 와 라는 명령어
    children: ReactNode;
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    // 그리고 그 복사해온 설명서에 {} 안에 있는 내용을 추가할게
}