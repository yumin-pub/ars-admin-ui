import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../../components/Button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        variant: {
            control: 'select',
            options: ['solid', 'outline', 'icon', 'box'],
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'neutral'],
        },
        size: {
            control: 'radio',
            options: ['lg', 'md'],
        },
        children: {
            control: 'text',
        },
        onClick: {
            action: 'clicked',
        },
    },

    args: {
        children: 'Button',
        variant: 'solid',
        color: 'primary',
        size: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Solid: Story = {
    args: {
        variant: 'solid',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
    },
};

export const Box: Story = {
    args: {
        variant: 'box',
    },
};

export const Icon: Story = {
    args: {
        variant: 'icon',
        children: '★',
    },
};

export const Primary: Story = {
    args: {
        color: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        color: 'secondary',
    },
};

export const Neutral: Story = {
    args: {
        color: 'neutral',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};