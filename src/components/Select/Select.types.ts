import type {
    SelectHTMLAttributes,
    ReactNode,
} from 'react';

export type SelectVariant = 
    | 'outline'
    | 'underline'
    | 'ghost';

export type SelectSize =
    | 'md'
    | 'lg';

export type SelectState =
    | 'default'
    | 'error'
    | 'success';

export interface SelectOption {
    label: ReactNode;
    value: string;
}

export interface SelectProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: ReactNode;
    helperText?: ReactNode;
    options?: SelectOption[];
    variant?: SelectVariant;
    SelectSize?: SelectSize;
    state?: SelectState;
    fieldClassName?: string;
    selectClassName?: string;  
}  