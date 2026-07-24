import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../../../components/Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        variant: {
            control: 'select',
            options: ['outline', 'underline', 'ghost'],
        },

        InputSize: {
            control: 'radio',
            options: ['md', 'lg'],
        },

        layout: {
            control: 'inline-radio',
            options: ['column', 'row'],
        },

        state: {
            control: 'select',
            options: ['default', 'success', 'error'],
        },

        clearable: {
            control: 'boolean',
        },

        disabled: {
            control: 'boolean',
        },

        readOnly: {
            control: 'boolean',
        },

        label: {
            control: 'text',
        },

        helperText: {
            control: 'text',
        },

        placeholder: {
            control: 'text',
        },
    },

    args: {
        label: 'Label',
        placeholder: 'Input...',
        helperText: 'Helper Message',
        variant: 'outline',
        InputSize: 'md',
        layout: 'column',
        state: 'default',
        clearable: false,
    },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const Outline: Story = {
    args: {
        variant: 'outline',
    },
};

export const Underline: Story = {
    args: {
        variant: 'underline',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
    },
};

export const Large: Story = {
    args: {
        InputSize: 'lg',
    },
};

export const Medium: Story = {
    args: {
        InputSize: 'md',
    },
};

export const Success: Story = {
    args: {
        state: 'success',
        helperText: 'Success Message',
    },
};

export const Error: Story = {
    args: {
        state: 'error',
        helperText: 'Error Message',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const ReadOnly: Story = {
    args: {
        readOnly: true,
        defaultValue: 'Readonly Value',
    },
};

export const Clearable: Story = {
    args: {
        clearable: true,
    },
};

export const PrefixSuffix: Story = {
    args: {
        prefixContent: '@',
        suffixContent: '.com',
    },
};