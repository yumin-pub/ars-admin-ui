// import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import type {
    Meta,
    StoryObj,
} from '@storybook/react-vite';

import { Pagination } from '../../../components/Pagination';
import PaginationPage from '../../../pages/UISystem/PaginationPage';

import type {
    PaginationProps,
} from '../../../components/Pagination';

function PaginationPlayground({
    totalPages,
    visiblePageCount,
    align,
    className,
}: PaginationProps) {
    const [{ page }, updateArgs] = useArgs();

    return (
        <Pagination
            page={page}
            totalPages={totalPages}
            visiblePageCount={visiblePageCount}
            align={align}
            className={className}
            onPageChange={(nextPage) => {
                updateArgs({
                    page: nextPage,
                });
            }}
        />
    );
}

const meta = {
    title: 'Components/Pagination',
    component: Pagination,
    parameters: {
        layout: 'padded',
    },
    args: {
        page: 3,
        totalPages: 10,
        visiblePageCount: 5,
        align: 'center',
        className: '',
        onPageChange: () => {},
    },
    argTypes: {
        page: {
            control: {
                type: 'number',
                min: 1,
            },
            description: '현재 페이지',
        },
        totalPages: {
            control: {
                type: 'number',
                min: 1,
            },
            description: '전체 페이지 수',
        },
        visiblePageCount: {
            control: {
                type: 'number',
                min: 1,
            },
            description: '한 번에 표시할 페이지 버튼 개수',
        },
        align: {
            control: 'select',
            options: [
                'left',
                'center',
                'right',
            ],
            description: '페이지네이션 정렬',
        },
        className: {
            control: 'text',
            description: '추가 클래스',
        },
        onPageChange: {
            table: {
                disable: true,
            },
        },
    },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => (
        <PaginationPlayground {...args} /> 
    ),
};

export const Examples: Story = {
    render: () => <PaginationPage />,
};