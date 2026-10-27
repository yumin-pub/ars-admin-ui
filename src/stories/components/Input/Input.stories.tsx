import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../../../components/Input';
import type { InputProps } from '../../../components/Input';
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

        helperTextId: {
            control: 'text',
            description: 'Helper Message 요소의 id. 지정하면 input의 aria-describedby에 연결된다',
        },

        ref: {
            control: false,
            description: 'input 요소 ref (React 19의 일반 prop)',
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

        onClear: {
            control: false,
            description: 'Clear Button 클릭 시 호출 (Enter·Space 포함)',
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

/**
 * clearable + onClear
 * 값을 비우는 일은 onClear에서 직접 한다. (controlled input)
 */
function ClearableInput(args: InputProps) {
    const [value, setValue] = useState('지울 수 있는 값');

    return (
        <Input
            {...args}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            clearable={value !== ''}
            onClear={() => setValue('')}
        />
    );
}

export const Clearable: Story = {
    args: {
        id: 'input-clearable',
        label: '검색어',
        helperText: '× 버튼(또는 Tab으로 이동 후 Enter·Space)으로 값을 지웁니다.',
    },

    render: (args) => <ClearableInput {...args} />,
};

/**
 * 오류 메시지를 aria-describedby로 연결 (helperTextId)
 */
export const ErrorDescribed: Story = {
    args: {
        id: 'input-error-described',
        label: '제목',
        state: 'error',
        helperText: '제목을 입력해 주세요.',
        helperTextId: 'input-error-described-message',
    },
};

export const Examples: Story = {
    render: () => <InputPage />,

    parameters: {
        layout: 'fullscreen',

        controls: {
            disable: true,
        },
    },
};