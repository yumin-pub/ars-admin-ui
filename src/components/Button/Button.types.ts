import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

export type ButtonVariant =
  | 'solid'
  | 'outline'

// danger: 삭제처럼 되돌리기 어려운 동작 (선택 값, 기본값은 그대로 primary)
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'danger';

export type ButtonSize =
  | 'lg'
  | 'md';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
}