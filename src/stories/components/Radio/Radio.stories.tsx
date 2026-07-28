import { useEffect, useState } from 'react';

import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from '../../../components/Radio';
import RadioPage from '../../../pages/UISystem/RadioPage';

function RadioPlayground({
    checked,
    onChange,
    ...props
}: ComponentProps<typeof Radio>) {
    const [isChecked, setIsChecked] = useState(Boolean(checked));

    useEffect(() => {
        setIsChecked(Boolean(checked));
    }, [checked]);

    return (
        <Radio
            {...props}
            checked={isChecked}
            onChange={(event) => {
                setIsChecked(event.target.checked);
                onChange?.(event);
            }}
        />
    );
}

const meta = {
    title: 'Components/Radio',
    component: Radio,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        structure: {
            control: 'inline-radio',
            options: ['wrap', 'detached'],
            description: '라디오와 라벨의 HTML 구조',
        },

        label: {
            control: 'text',
            description: '라디오 라벨',
        },

        checked: {
            control: 'boolean',
            description: '선택 여부',
        },

        disabled: {
            control: 'boolean',
            description: '비활성화 여부',
        },

        id: {
            control: 'text',
            description: '라디오 식별자',
        },

        name: {
            control: 'text',
            description: '같은 그룹을 묶는 name',
        },

        children: {
            control: false,
        },

        className: {
            control: 'text',
            description: '추가 클래스',
        },

        onChange: {
            action: 'changed',
        },
    },

    args: {
        id: 'radio-playground',
        name: 'radio-group',
        label: 'Radio',
        structure: 'wrap',
        checked: false,
        disabled: false,
        className: '',
    },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => <RadioPlayground {...args} />,
};

export const Examples: Story = {
    render: () => <RadioPage />,

    parameters: {
        layout: 'fullscreen',

        controls: {
            disable: true,
        },
    },
};