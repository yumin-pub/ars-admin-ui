import type { Meta, StoryObj } from '@storybook/react';

import { ZIndexPreview } from './ZIndexPreview';

const meta: Meta<typeof ZIndexPreview> = {
    title: 'Foundation/Z-index',
    component: ZIndexPreview,

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

type Story = StoryObj<typeof ZIndexPreview>;

export const Preview: Story = {
    name: 'Z-index Tokens',
};