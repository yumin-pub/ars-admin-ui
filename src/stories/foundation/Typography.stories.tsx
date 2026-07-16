import type { Meta, StoryObj } from '@storybook/react';

import { TypographyPreview } from './TypographyPreview';

const meta: Meta<typeof TypographyPreview> = {
    title: 'Foundation/Typography',
    component: TypographyPreview,

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

type Story = StoryObj<typeof TypographyPreview>;

export const Preview: Story = {
    name: 'Typography Tokens',
};