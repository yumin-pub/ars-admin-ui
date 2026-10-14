// import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '../../../components/Checkbox';
import CheckboxPage from '../../../pages/UISystem/CheckboxPage';

const meta = {      
    title: 'Components/Checkbox',
    component: Checkbox,

    parameters: {
        layout: 'centered',
    },

    argTypes: {
        structure: {
            control: 'inline-radio',
            options: ['wrap', 'detached'],
            description: '체크박스와 라벨의 HTML 구조',
        },

        label: {
            control: 'text',
            description: '체크박스 라벨',
        },

        checked: {
            control: 'boolean',
            description: '체크 여부',
        },

        disabled: {
            control: 'boolean',
            description: '비활성화 여부',
        },

        id: {
            control: 'text',
            description: '체크박스 식별자',
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
        id: 'checkbox-playground',
        label: 'Checkbox',
        structure: 'wrap',
        checked: false,
        disabled: false,
        className: '',
    },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    // useArgs는 스토리 함수(render) 안에서 직접 호출해야 한다.
    render: function CheckboxPlaygroundRender({ onChange, ...args }) {
        const [{ checked }, updateArgs] = useArgs();

        return (
            <Checkbox
                {...args}
                checked={Boolean(checked)}
                onChange={(event) => {
                    updateArgs({
                        checked: event.target.checked,
                    });

                    onChange?.(event);
                }}
            />
        );
    },
};

export const Examples: Story = {
    render: () => <CheckboxPage />,

    parameters: {
        layout: 'fullscreen',
        controls: {
            disable: true,
        },
    },
};