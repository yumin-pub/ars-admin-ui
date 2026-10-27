import { useEffect, useRef, useState } from 'react';
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

const ITEMS = ['사과', '배', '포도'];

/**
 * 전체 선택 + 일부 선택(indeterminate)
 * indeterminate는 HTML 속성이 아니라 DOM 속성이라 ref로 준다.
 */
function IndeterminateExample() {
    const [selected, setSelected] = useState<string[]>(['사과']);
    const allRef = useRef<HTMLInputElement>(null);

    const allChecked = selected.length === ITEMS.length;
    const someChecked = selected.length > 0 && !allChecked;

    useEffect(() => {
        if (allRef.current) allRef.current.indeterminate = someChecked;
    }, [someChecked]);

    return (
        <div style={{ display: 'grid', gap: '8px' }}>
            <Checkbox
                ref={allRef}
                checked={allChecked}
                onChange={() => setSelected(allChecked ? [] : ITEMS)}
            >
                전체 선택
            </Checkbox>

            {ITEMS.map((item) => (
                <Checkbox
                    key={item}
                    checked={selected.includes(item)}
                    onChange={() => setSelected((prev) => (
                        prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
                    ))}
                >
                    {item}
                </Checkbox>
            ))}
        </div>
    );
}

export const Indeterminate: Story = {
    render: () => <IndeterminateExample />,

    parameters: {
        controls: {
            disable: true,
        },
    },
};

/**
 * 일부 선택(indeterminate)과 다른 상태의 조합
 * 일부 선택은 checked와 함께여도 가로줄로 보이고, 비활성이면 회색 가로줄로 보인다.
 */
function setIndeterminate(input: HTMLInputElement | null) {
    if (input) input.indeterminate = true;
}

export const IndeterminateStates: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '8px' }}>
            <Checkbox ref={setIndeterminate}>일부 선택</Checkbox>
            <Checkbox ref={setIndeterminate} disabled>일부 선택 + 비활성</Checkbox>
            <Checkbox ref={setIndeterminate} defaultChecked>일부 선택 + checked</Checkbox>
            <Checkbox ref={setIndeterminate} defaultChecked disabled>일부 선택 + checked + 비활성</Checkbox>
        </div>
    ),

    parameters: {
        controls: {
            disable: true,
        },
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