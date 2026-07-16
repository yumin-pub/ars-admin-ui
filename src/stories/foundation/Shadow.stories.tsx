import type { Meta, StoryObj } from '@storybook/react';

import { ShadowPreview } from './ShadowPreview';

const meta: Meta<typeof ShadowPreview> = {
    title: 'Foundation/Shadow',
    component: ShadowPreview,

    parameters: {
        layout: 'padded',
        controls: {
            disable: true,
        },
        actions: {
            disable: true,
        },
    },
};

export default meta;

type Story = StoryObj<typeof ShadowPreview>;

export const Preview: Story = {
    name: 'Shadow Tokens',
};