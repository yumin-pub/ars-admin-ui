import type { ReactNode } from 'react';
import type { TableProps, TableRow } from './Table.types';

function Table<T extends TableRow = TableRow>({
    columns,
    data,
    emptyMessage = '검색 결과가 없습니다.',
    loading = false,
    className = '',
}: TableProps<T>) {
    const tableClassNameList = [
        'ui-table',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="ui-table-wrap">
            <table className={tableClassNameList}>
                <thead className="ui-table__head">
                    <tr>
                        {columns.map((columnData) => (
                            <th
                                key={String(columnData.dataIndex)}
                                scope="col"
                                style={{
                                    width: columnData.width,
                                    textAlign: columnData.align,
                                }}
                            >
                                {columnData.title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="ui-table__body">
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="ui-table__empty"
                            >
                                데이터를 불러오는 중입니다.
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={row.id}>
                                {columns.map((column) => {
                                    const value = row[column.dataIndex];

                                    return (
                                        <td key={String(column.dataIndex)}>
                                            {column.render
                                                ? column.render(value, row, index)
                                                : (value as ReactNode)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="ui-table__empty"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;