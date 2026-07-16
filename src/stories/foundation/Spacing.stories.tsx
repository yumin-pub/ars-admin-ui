import type { Meta, StoryObj } from '@storybook/react';

import { SpacingPreview } from './SpacingPreview';

const meta: Meta<typeof SpacingPreview> = {
    title: 'Foundation/Spacing',
    component: SpacingPreview,

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

type Story = StoryObj<typeof SpacingPreview>;

export const Preview: Story = {
    name: 'Spacing Tokens',
};