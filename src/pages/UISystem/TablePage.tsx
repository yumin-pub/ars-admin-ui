import { useState } from 'react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { Table } from '../../components/Table';

import type {
    TableColumn,
    TableRow,
} from '../../components/Table';

/* ==========================
 * Row 타입 정의
 * (백엔드에서 내려올 법한 원시 데이터 모양)
 * ========================== */

interface BasicRow extends TableRow {
    id: number;
    title: string;
    status: 'exposed' | 'hidden';
    date: string;
}

interface SelectableRow extends TableRow {
    id: number;
    checked: boolean;
    title: string;
    status: 'exposed' | 'hidden' | 'scheduled';
    date: string;
}

function TablePage() {

    /* ==========================
     * Basic Table
     * ========================== */

    const basicColumns: TableColumn<BasicRow>[] = [
        { dataIndex: 'id', title: '번호', width: '80px' },
        { dataIndex: 'title', title: '제목' },
        {
            dataIndex: 'status',
            title: '상태',
            width: '120px',
            render: (value) => (
                <Badge variant={value === 'exposed' ? 'success' : 'neutral'}>
                    {value === 'exposed' ? '노출중' : '미노출'}
                </Badge>
            ),
        },
        { dataIndex: 'date', title: '등록일', width: '120px' },
        {
            dataIndex: 'id', // 별도 raw 데이터가 필요 없는 컬럼이라 id를 재사용
            title: '관리',
            width: '160px',
            render: () => (
                <div className="ui-table__actions">
                    <Button variant="outline" color="neutral" size="md">
                        수정
                    </Button>

                    <Button variant="outline" color="neutral" size="md">
                        삭제
                    </Button>
                </div>
            ),
        },
    ];

    const basicData: BasicRow[] = [
        {
            id: 1,
            title: '긴급공지 안내',
            status: 'exposed',
            date: '2026-06-10',
        },
        {
            id: 2,
            title: '시스템 점검 안내',
            status: 'hidden',
            date: '2026-06-12',
        },
    ];


    /* ==========================
     * Selectable Table
     * ========================== */

    const selectableData: SelectableRow[] = [
        {
            id: 1,
            checked: true,
            title: '긴급공지 안내',
            status: 'exposed',
            date: '2026-06-10',
        },
        {
            id: 2,
            checked: false,
            title: '시스템 점검 안내',
            status: 'scheduled',
            date: '2026-06-12',
        },
    ];

    // 선택 상태는 부모가 관리하고, Table에는 selectedIds로 넘긴다.
    const [selectedIds, setSelectedIds] = useState<Array<SelectableRow['id']>>(
        () => selectableData.filter((row) => row.checked).map((row) => row.id),
    );

    const toggleRow = (id: SelectableRow['id']) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((selectedId) => selectedId !== id)
                : [...prev, id],
        );
    };

    const selectableColumns: TableColumn<SelectableRow>[] = [
        {
            dataIndex: 'id', // checked 값을 쓰지만 컬럼 키 자체는 id로 재사용
            title: '선택',
            width: '56px',
            align: 'center',
            render: (_, row) => (
                <Checkbox
                    id={`table-row-${row.id}`}
                    aria-label={`${row.id}번 항목 선택`}
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                />
            ),
        },
        { dataIndex: 'id', title: '번호', width: '80px' },
        { dataIndex: 'title', title: '제목' },
        {
            dataIndex: 'status',
            title: '상태',
            width: '120px',
            render: (_, row) => {
                const statusMap = {
                    exposed: { variant: 'success', label: '노출중' },
                    hidden: { variant: 'neutral', label: '미노출' },
                    scheduled: { variant: 'warning', label: '예약' },
                } as const;

                const { variant, label } = statusMap[row.status];

                return <Badge variant={variant}>{label}</Badge>;
            },
        },
        { dataIndex: 'date', title: '등록일', width: '120px' },
        {
            dataIndex: 'id',
            title: '관리',
            width: '160px',
            render: () => (
                <div className="ui-table__actions">
                    <Button variant="outline" color="neutral" size="md">
                        수정
                    </Button>

                    <Button variant="outline" color="neutral" size="md">
                        삭제
                    </Button>
                </div>
            ),
        },
    ];


    /* ==========================
     * Empty Table
     * ========================== */

    const emptyColumns: TableColumn<BasicRow>[] = [
        { dataIndex: 'id', title: '번호', width: '80px' },
        { dataIndex: 'title', title: '제목' },
        { dataIndex: 'status', title: '상태', width: '120px' },
        { dataIndex: 'date', title: '등록일', width: '120px' },
    ];

    return (
        <main className="ui-doc">
            <h1 className="ui-doc__title">Table</h1>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">1. HTML Table Class</h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Basic Table</h3>

                    <div className="ui-table-wrap">
                        <table className="ui-table">
                        <thead className="ui-table__head">
                            <tr>
                                <th scope="col" className="ui-table__cell-sm">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col" className="ui-table__cell-md">상태</th>
                                <th scope="col" className="ui-table__cell-md">등록일</th>
                                <th scope="col" className="ui-table__cell-lg">관리</th>
                            </tr>
                        </thead>

                        <tbody className="ui-table__body">
                            <tr>
                                <td>1</td>
                                <td className="ui-table__cell-title">긴급공지 안내</td>
                                <td>
                                    <span className="ui-badge ui-badge--success">노출중</span>
                                </td>
                                <td>2026-06-10</td>
                                <td>
                                    <div className="ui-table__actions">
                                    <Button variant="outline" color="neutral" size="md">
                                        수정
                                    </Button>
                                    <Button variant="outline" color="neutral" size="md">
                                        삭제
                                    </Button>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>2</td>
                                <td className="ui-table__cell-title">시스템 점검 안내</td>
                                <td>
                                    <span className="ui-badge ui-badge--neutral">미노출</span>
                                </td>
                                <td>2026-06-12</td>
                                <td>
                                    <div className="ui-table__actions">
                                    <Button variant="outline" color="neutral" size="md">
                                        수정
                                    </Button>
                                    <Button variant="outline" color="neutral" size="md">
                                        삭제
                                    </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Selectable Table</h3>

                    <div className="ui-table-wrap">
                        <table className="ui-table ui-table--selectable">
                        <thead className="ui-table__head">
                            <tr>
                                <th scope="col" className="ui-table__cell-checkbox">
                                    선택
                                </th>
                                <th scope="col" className="ui-table__cell-sm">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col" className="ui-table__cell-md">상태</th>
                                <th scope="col" className="ui-table__cell-md">등록일</th>
                                <th scope="col" className="ui-table__cell-lg">관리</th>
                            </tr>
                        </thead>

                        <tbody className="ui-table__body">
                            <tr className="is-selected">
                                <td className="ui-table__cell-checkbox">
                                    <Checkbox id="table-row-1" aria-label="1번 항목 선택" defaultChecked />
                                </td>
                                <td>1</td>
                                <td className="ui-table__cell-title">긴급공지 안내</td>
                                <td>
                                    <span className="ui-badge ui-badge--success">노출중</span>
                                </td>
                                <td>2026-06-10</td>
                                <td>
                                    <div className="ui-table__actions">
                                    <Button variant="outline" color="neutral" size="md">
                                        수정
                                    </Button>
                                    <Button variant="outline" color="neutral" size="md">
                                        삭제
                                    </Button>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td className="ui-table__cell-checkbox">
                                    <Checkbox id="table-row-2" aria-label="2번 항목 선택" />
                                </td>
                                <td>2</td>
                                <td className="ui-table__cell-title">시스템 점검 안내</td>
                                <td>
                                    <span className="ui-badge ui-badge--warning">예약</span>
                                </td>
                                <td>2026-06-12</td>
                                <td>
                                    <div className="ui-table__actions">
                                    <Button variant="outline" color="neutral" size="md">
                                        수정
                                    </Button>
                                    <Button variant="outline" color="neutral" size="md">
                                        삭제
                                    </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Empty State</h3>

                    <div className="ui-table-wrap">
                        <table className="ui-table">
                            <thead className="ui-table__head">
                                <tr>
                                <th scope="col" className="ui-table__cell-sm">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col" className="ui-table__cell-md">상태</th>
                                <th scope="col" className="ui-table__cell-md">등록일</th>
                                </tr>
                            </thead>

                            <tbody className="ui-table__body">
                                <tr>
                                <td colSpan={4} className="ui-table__empty">
                                    검색 결과가 없습니다.
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Refreshing State</h3>

                    {/* 행은 그대로 두고 Loading overlay를 덮는다. overlay는 시각 표시 전용(aria-hidden) */}
                    <div className="ui-table-wrap is-refreshing">
                        <table
                            className="ui-table"
                            aria-label="다시 불러오는 중인 표 예시 (HTML)"
                            aria-busy="true"
                        >
                            <thead className="ui-table__head">
                                <tr>
                                <th scope="col" className="ui-table__cell-sm">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col" className="ui-table__cell-md">상태</th>
                                <th scope="col" className="ui-table__cell-md">등록일</th>
                                </tr>
                            </thead>

                            <tbody className="ui-table__body">
                                <tr>
                                <td>1</td>
                                <td className="ui-table__cell-title">긴급공지 안내</td>
                                <td>
                                    <span className="ui-badge ui-badge--success">노출중</span>
                                </td>
                                <td>2026-06-10</td>
                                </tr>

                                <tr>
                                <td>2</td>
                                <td className="ui-table__cell-title">시스템 점검 안내</td>
                                <td>
                                    <span className="ui-badge ui-badge--neutral">미노출</span>
                                </td>
                                <td>2026-06-12</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="ui-table__refreshing" aria-hidden="true">
                            <div
                                className="ui-loading ui-loading--sm ui-loading--overlay"
                                role="status"
                                aria-live="polite"
                                aria-busy="true"
                            >
                                <div className="ui-loading__panel">
                                    <span className="ui-loading__spinner" aria-hidden="true" />

                                    <div className="ui-loading__content">
                                        <p className="ui-loading__message">
                                            데이터를 불러오는 중입니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    2. React Table Component
                </h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Basic Table
                    </h3>

                    <Table<BasicRow>
                        columns={basicColumns}
                        data={basicData}
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Selectable Table
                    </h3>

                    <Table<SelectableRow>
                        className="ui-table--selectable"
                        columns={selectableColumns}
                        data={selectableData}
                        selectedIds={selectedIds}
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Empty Table
                    </h3>

                    <Table<BasicRow>
                        columns={emptyColumns}
                        data={[]}
                        emptyMessage="검색 결과가 없습니다."
                    />
                </div>
                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Loading Table
                    </h3>

                    <Table<BasicRow>
                        columns={emptyColumns}
                        data={[]}
                        loading
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Refreshing Table
                    </h3>

                    <Table<BasicRow>
                        columns={basicColumns}
                        data={basicData}
                        refreshing
                        ariaLabel="다시 불러오는 중인 표 예시"
                    />
                </div>
            </section>      
        </main>
    );
}

export default TablePage;