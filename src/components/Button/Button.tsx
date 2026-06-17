// import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ButtonProps } from './Button.types';

// type ButtonVariant = 'solid' | 'outline' | 'icon' | 'box';
// type ButtonColor = 'primary' | 'secondary' | 'neutral';
// type ButtonSize = 'lg' | 'md';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//     children: ReactNode;
//     variant?: ButtonVariant;
//     color?: ButtonColor;
//     size?: ButtonSize;
//     }

function Button({
    children,
    variant = 'solid',
    color = 'primary',
    size = 'md',
    className = '',
    ...props
    }: ButtonProps) {
    const buttonClassName = [
        'ui-btn',
        `ui-btn--${variant}`,
        `ui-btn--${color}`,
        `ui-btn--${size}`,
        className,
    ]
        .filter(Boolean) // 빈값 제거 = 쓸모 없는 값 청소
        .join(' ');

    return (
        <button className={buttonClassName} {...props}>
        {children}
        </button>
    );
}

export default Button;