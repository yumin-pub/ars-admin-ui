// import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio } from '../../../components/Radio';
import RadioPage from '../../../pages/UISystem/RadioPage';

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
    // useArgs는 스토리 함수(render) 안에서 직접 호출해야 한다.
    render: function RadioPlaygroundRender({ onChange, ...args }) {
        const [{ checked }, updateArgs] = useArgs();

        return (
            <Radio
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
    render: () => <RadioPage />,

    parameters: {
        layout: 'fullscreen',

        controls: {
            disable: true,
        },
    },
};