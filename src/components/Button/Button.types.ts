import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

export type ButtonVariant =
  | 'solid'
  | 'outline'

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'neutral';

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