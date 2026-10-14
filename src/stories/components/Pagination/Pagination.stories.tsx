// import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import type {
    Meta,
    StoryObj,
} from '@storybook/react-vite';

import { Pagination } from '../../../components/Pagination';
import PaginationPage from '../../../pages/UISystem/PaginationPage';

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
        ariaLabel: {
            control: 'text',
            description: 'nav 영역의 이름(aria-label)',
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
    // useArgs는 스토리 함수(render) 안에서 직접 호출해야 한다.
    render: function PaginationPlaygroundRender({
        totalPages,
        visiblePageCount,
        align,
        ariaLabel,
        className,
    }) {
        const [{ page }, updateArgs] = useArgs();

        return (
            <Pagination
                page={page}
                totalPages={totalPages}
                visiblePageCount={visiblePageCount}
                align={align}
                ariaLabel={ariaLabel}
                className={className}
                onPageChange={(nextPage) => {
                    updateArgs({
                        page: nextPage,
                    });
                }}
            />
        );
    },
};

export const Examples: Story = {
    render: () => <PaginationPage />,
};