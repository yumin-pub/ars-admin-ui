import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from '../../../components/Table';
import TablePage from '../../../pages/UISystem/TablePage';

import type {
    TableColumn,
    TableProps,
    TableRow,
} from '../../../components/Table';

interface StoryRow extends TableRow {
    id: number;
    title: string;
    status: string;
    date: string;
}

const columns: TableColumn<StoryRow>[] = [
    {
        dataIndex: 'id',
        title: '번호',
        width: '80px',
    },
    {
        dataIndex: 'title',
        title: '제목',
    },
    {
        dataIndex: 'status',
        title: '상태',
        width: '120px',
    },
    {
        dataIndex: 'date',
        title: '등록일',
        width: '120px',
    },
];

const data: StoryRow[] = [
    {
        id: 1,
        title: '긴급공지 안내',
        status: '노출중',
        date: '2026-06-10',
    },
    {
        id: 2,
        title: '시스템 점검 안내',
        status: '미노출',
        date: '2026-06-12',
    },
];
function StoryTable(props: TableProps<StoryRow>) {
    return <Table<StoryRow> {...props} />;
}
const meta = {
    title: 'Components/Table',
    component: StoryTable,
    parameters: {
        layout: 'padded',
    },
    args: {
        columns,
        data,
        loading: false,
        refreshing: false,
        emptyMessage: '검색 결과가 없습니다.',
    },
} satisfies Meta<typeof StoryTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Caption: Story = {
    args: {
        caption: '공지사항 목록',
    },
};

export const AriaLabel: Story = {
    args: {
        ariaLabel: '공지사항 목록',
    },
};

export const Refreshing: Story = {
    args: {
        refreshing: true,
        refreshingMessage: '다음 페이지를 불러오는 중입니다.',
    },
};

export const Examples: Story = {
    render: () => <TablePage />,
};