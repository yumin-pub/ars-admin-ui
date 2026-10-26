import type { ReactNode } from 'react';

import { Loading } from '../Loading';
import type { TableProps, TableRow } from './Table.types';

function Table<T extends TableRow = TableRow>({
    columns,
    data,
    emptyMessage = '검색 결과가 없습니다.',
    loading = false,
    refreshing = false,
    refreshingMessage = '데이터를 불러오는 중입니다.',
    selectedIds = [],
    ariaLabel,
    caption,
    className = '',
}: TableProps<T>) {
    const tableClassNameList = [
        'ui-table',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    /**
     * 화면에 그릴 내용이 없는 caption(undefined, null, '', boolean)은
     * 요소를 만들지 않는다. 0은 표시한다.
     */
    const hasCaption =
        caption !== undefined &&
        caption !== null &&
        caption !== '' &&
        typeof caption !== 'boolean';

    /**
     * 초기 로딩(loading) 중에는 refreshing을 무시한다.
     */
    const isRefreshing = refreshing && !loading;

    return (
        <div
            className={
                isRefreshing
                    ? 'ui-table-wrap is-refreshing'
                    : 'ui-table-wrap'
            }
        >
            <table
                className={tableClassNameList}
                aria-label={ariaLabel}
                aria-busy={isRefreshing ? true : undefined}
            >
                {hasCaption && (
                    <caption className="ui-table__caption">
                        {caption}
                    </caption>
                )}

                <thead className="ui-table__head">
                    <tr>
                        {columns.map((columnData, columnIndex) => (
                            <th
                                key={`${String(columnData.dataIndex)}-${columnIndex}`}
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
                            <tr
                                key={row.id}
                                className={
                                    selectedIds.includes(row.id)
                                        ? 'is-selected'
                                        : undefined
                                }
                            >
                                {columns.map((column, columnIndex) => {
                                    const value = row[column.dataIndex];

                                    return (
                                        <td
                                            key={`${String(column.dataIndex)}-${columnIndex}`}
                                            style={{
                                                textAlign: column.align,
                                            }}
                                        >
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

            {/*
                시각 표시 전용. Loading은 role="status" live 영역이라
                화면의 결과 안내(aria-live)와 겹쳐 두 번 읽히지 않도록 숨긴다.
                바쁜 상태는 table의 aria-busy로 전달한다.
            */}
            {isRefreshing && (
                <div
                    className="ui-table__refreshing"
                    aria-hidden="true"
                >
                    <Loading
                        size="sm"
                        message={refreshingMessage}
                        description={null}
                    />
                </div>
            )}
        </div>
    );
}

export default Table;