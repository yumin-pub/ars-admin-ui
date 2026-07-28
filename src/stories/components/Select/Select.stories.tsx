import type { Meta, StoryObj } from '@storybook/react';

import { Select } from '../../../components/Select';
import SelectPage from '../../../pages/UISystem/SelectPage';

const meta = {
    title: 'Components/Select',
    component: Select,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        variant: {
            control: 'select',
            options: ['outline', 'underline', 'ghost'],
            description: 'Select 스타일',
        },

        SelectSize: {
            control: 'inline-radio',
            options: ['md', 'lg'],
            description: 'Select 크기',
        },

        state: {
            control: 'select',
            options: ['default', 'success', 'error'],
            description: 'Select 상태',
        },

        label: {
            control: 'text',
            description: 'Label',
        },

        helperText: {
            control: 'text',
            description: 'Helper Message',
        },

        disabled: {
            control: 'boolean',
            description: 'Disabled',
        },

        fieldClassName: {
            control: 'text',
        },

        selectClassName: {
            control: 'text',
        },

        className: {
            control: 'text',
        },
    },

    args: {
        id: 'select-playground',
        label: 'Label',
        helperText: 'Helper Message',
        variant: 'outline',
        SelectSize: 'md',
        state: 'default',
        disabled: false,

        options: [
            {
                label: 'Option 1',
                value: 'option1',
            },
            {
                label: 'Option 2',
                value: 'option2',
            },
            {
                label: 'Option 3',
                value: 'option3',
            },
        ],

        className: '',
        fieldClassName: '',
        selectClassName: '',
    },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
    render: () => <SelectPage />,

    parameters: {
        layout: 'fullscreen',

        controls: {
            disable: true,
        },
    },
};