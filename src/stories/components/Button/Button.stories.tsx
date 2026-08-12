import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../../components/Button';
import ButtonPage from '../../../pages/UISystem/ButtonPage';

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

export const Examples: Story = {
    render: () => <ButtonPage />,
    parameters: {
        layout: 'fullscreen',
    },
};