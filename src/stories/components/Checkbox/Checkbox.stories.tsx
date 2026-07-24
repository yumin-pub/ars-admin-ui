import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../../../components/Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        structure: {
            control: 'inline-radio',
            options: ['wrap', 'detached'],
        },

        label: {
            control: 'text',
        },

        checked: {
            control: 'boolean',
        },

        disabled: {
            control: 'boolean',
        },
    },

    args: {
        label: 'Checkbox',
        structure: 'wrap',
    },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {};

export const Wrap: Story = {
    args: {
        structure: 'wrap',
    },
};

export const Detached: Story = {
    args: {
        structure: 'detached',
    },
};

export const Checked: Story = {
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const CheckedDisabled: Story = {
    args: {
        checked: true,
        disabled: true,
    },
};