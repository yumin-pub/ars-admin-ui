import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../../../components/Input';
import InputPage from '../../../pages/UISystem/InputPage';

const meta = {
    title: 'Components/Input',
    component: Input,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        variant: {
            control: 'select',
            options: ['outline', 'underline', 'ghost'],
            description: 'Input 스타일',
        },

        size: {
            control: 'inline-radio',
            options: ['md', 'lg'],
            description: 'Input 크기',
        },

        layout: {
            control: 'inline-radio',
            options: ['column', 'row'],
            description: 'Label 배치',
        },

        state: {
            control: 'select',
            options: ['default', 'success', 'error'],
            description: 'Input 상태',
        },

        label: {
            control: 'text',
            description: 'Label',
        },

        helperText: {
            control: 'text',
            description: 'Helper Message',
        },

        placeholder: {
            control: 'text',
            description: 'Placeholder',
        },

        defaultValue: {
            control: 'text',
            description: '기본값',
        },

        prefixContent: {
            control: 'text',
            description: 'Prefix',
        },

        suffixContent: {
            control: 'text',
            description: 'Suffix',
        },

        counter: {
            control: 'text',
            description: 'Counter',
        },

        clearable: {
            control: 'boolean',
            description: 'Clear Button',
        },

        disabled: {
            control: 'boolean',
            description: 'Disabled',
        },

        readOnly: {
            control: 'boolean',
            description: 'Readonly',
        },

        fieldClassName: {
            control: 'text',
        },

        inputClassName: {
            control: 'text',
        },

        className: {
            control: 'text',
        },
    },

    args: {
        id: 'input-playground',
        label: 'Label',
        placeholder: 'Input...',
        helperText: 'Helper Message',
        variant: 'outline',
        size: 'md',
        layout: 'column',
        state: 'default',
        clearable: false,
        disabled: false,
        readOnly: false,
        className: '',
        fieldClassName: '',
        inputClassName: '',
    },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
    render: () => <InputPage />,

    parameters: {
        layout: 'fullscreen',

        controls: {
            disable: true,
        },
    },
};