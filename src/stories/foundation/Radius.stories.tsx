import type { Meta, StoryObj } from '@storybook/react';

import { RadiusPreview } from './RadiusPreview';

const meta: Meta<typeof RadiusPreview> = {
    title: 'Foundation/Radius',
    component: RadiusPreview,

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

type Story = StoryObj<typeof RadiusPreview>;

export const Preview: Story = {
    name: 'Radius Tokens',
};