import type { Meta, StoryObj } from '@storybook/react';

import { PrimitivePreview } from './PrimitivePreview';

const meta: Meta<typeof PrimitivePreview> = {
    title: 'Foundation/Primitive',
    component: PrimitivePreview,

    parameters: {
        layout: 'padded',
        controls: {
            disable: true,
        },
        actions: {
            disable: true,
        },
        docs: {
            disable: true,
        },
    },

};

export default meta;

type Story = StoryObj<typeof PrimitivePreview>;

export const Preview: Story = {
    name: 'Primitive Tokens',
};