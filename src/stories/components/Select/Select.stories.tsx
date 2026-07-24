import type { Meta, StoryObj } from '@storybook/react';

import { Select } from '../../../components/Select';

const meta: Meta<typeof Select> = {
    title: 'Components/Select',
    component: Select,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        variant: {
            control: 'select',
            options: ['outline', 'underline', 'ghost'],
        },

        SelectSize: {
            control: 'inline-radio',
            options: ['md', 'lg'],
        },

        state: {
            control: 'select',
            options: ['default', 'success', 'error'],
        },

        disabled: {
            control: 'boolean',
        },

        label: {
            control: 'text',
        },

        helperText: {
            control: 'text',
        },
    },

    args: {
        label: 'Label',
        helperText: 'Helper Message',
        variant: 'outline',
        SelectSize: 'md',
        state: 'default',

        options: [
            {
                label: 'Option 1',
                value: 'option1',
            },
            {
                label: 'Option 2',
                value: 'option2',
            },
            {
                label: 'Option 3',
                value: 'option3',
            },
        ],
    },
};

export default meta;

type Story = StoryObj<typeof Select>;

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
        SelectSize: 'lg',
    },
};

export const Medium: Story = {
    args: {
        SelectSize: 'md',
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