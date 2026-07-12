import type { TableProps } from './Table.types';

function Table({
    columns,
    data,
    emptyMessage = '검색 결과가 없습니다.',
    loading = false,
    className = '',
}: TableProps) {
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
                                key={columnData.dataIndex}
                                scope="col"                                                                                                                                                                                                                                             Z
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
                        data.map((row) => (
                            <tr key={row.id}>
                                {columns.map((column) => (
                                    <td key={column.dataIndex}>
                                        {row[column.dataIndex]}
                                    </td>
                                ))}
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