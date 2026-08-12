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
    },
    {
        dataIndex: 'title',
        title: '제목',
    },
    {
        dataIndex: 'status',
        title: '상태',
    },
    {
        dataIndex: 'date',
        title: '등록일',
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
        emptyMessage: '검색 결과가 없습니다.',
    },
} satisfies Meta<typeof StoryTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
    render: () => <TablePage />,
};