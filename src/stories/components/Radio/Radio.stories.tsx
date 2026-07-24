import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from '../../../components/Radio';

const meta: Meta<typeof Radio> = {
    title: 'Components/Radio',
    component: Radio,

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

        name: {
            control: 'text',
        },
    },

    args: {
        label: 'Radio',
        structure: 'wrap',
        name: 'radio-group',
    },
};

export default meta;

type Story = StoryObj<typeof Radio>;

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