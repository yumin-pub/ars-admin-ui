import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { Table } from '../../components/Table';

import type {
    TableColumn,
    TableRow,
} from '../../components/Table';
function TablePage() {

    /* ==========================
     * Basic Table
     * ========================== */

    const basicColumns: TableColumn[] = [
        { dataIndex: 'id', title: '번호' },
        { dataIndex: 'title', title: '제목' },
        { dataIndex: 'status', title: '상태' },
        { dataIndex: 'date', title: '등록일' },
        { dataIndex: 'action', title: '관리' },
    ];

    const basicData: TableRow[] = [
        {
            id: 1,
            title: '긴급공지 안내',
            status: (
                <span className="ui-badge ui-badge--success">
                    노출중
                </span>
            ),
            date: '2026-06-10',
            action: (
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
        {
            id: 2,
            title: '시스템 점검 안내',
            status: (
                <span className="ui-badge ui-badge--neutral">
                    미노출
                </span>
            ),
            date: '2026-06-12',
            action: (
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
     * Selectable Table
     * ========================== */

    const selectableColumns: TableColumn[] = [
        { dataIndex: 'checkbox', title: '선택' },
        { dataIndex: 'id', title: '번호' },
        { dataIndex: 'title', title: '제목' },
        { dataIndex: 'status', title: '상태' },
        { dataIndex: 'date', title: '등록일' },
        { dataIndex: 'action', title: '관리' },
    ];

    const selectableData: TableRow[] = [
        {
            id: 1,
            checkbox: (
                <Checkbox
                    id="table-row-1"
                    aria-label="1번 항목 선택"
                    defaultChecked
                />
            ),
            title: '긴급공지 안내',
            status: (
                <span className="ui-badge ui-badge--success">
                    노출중
                </span>
            ),
            date: '2026-06-10',
            action: (
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
        {
            id: 2,
            checkbox: (
                <Checkbox
                    id="table-row-2"
                    aria-label="2번 항목 선택"
                />
            ),
            title: '시스템 점검 안내',
            status: (
                <span className="ui-badge ui-badge--warning">
                    예약
                </span>
            ),
            date: '2026-06-12',
            action: (
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

    const emptyColumns: TableColumn[] = [
        { dataIndex: 'id', title: '번호' },
        { dataIndex: 'title', title: '제목' },
        { dataIndex: 'status', title: '상태' },
        { dataIndex: 'date', title: '등록일' },
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
                                <th scope="col">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col">상태</th>
                                <th scope="col">등록일</th>
                                <th scope="col">관리</th>
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
                                <th scope="col">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col">상태</th>
                                <th scope="col">등록일</th>
                                <th scope="col">관리</th>
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
                                <th scope="col">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col">상태</th>
                                <th scope="col">등록일</th>
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
            </section>
            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">
                    2. React Table Component
                </h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Basic Table
                    </h3>

                    <Table
                        columns={basicColumns}
                        data={basicData}
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Selectable Table
                    </h3>

                    <Table
                        className="ui-table--selectable"
                        columns={selectableColumns}
                        data={selectableData}
                    />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Empty Table
                    </h3>

                    <Table
                        columns={emptyColumns}
                        data={[]}
                        emptyMessage="검색 결과가 없습니다."
                    />
                </div>
                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">
                        Loading Table
                    </h3>

                    <Table
                        columns={emptyColumns}
                        data={[]}
                        loading
                    />
                </div>
            </section>      
        </main>
    );
}

export default TablePage;