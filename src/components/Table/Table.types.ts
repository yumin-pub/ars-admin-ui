import type { ReactNode } from 'react';

/**
 * Table Row
 * 모든 행 데이터는 최소한 id를 가져야 한다.
 * 나머지 필드는 사용하는 쪽에서 extends 하여 구체적으로 정의한다.
 * (예: interface UserRow extends TableRow { name: string; age: number; })
 */
export interface TableRow {
    id: number | string;
}

/**
 * Table Column
 * T: 이 컬럼이 속한 행 데이터의 실제 타입 (기본값 TableRow)
 */
export interface TableColumn<T extends TableRow = TableRow> {
    /**
     * 데이터를 찾기 위한 이름(key)
     * T에 실제로 존재하는 필드만 지정할 수 있다.
     */
    dataIndex: keyof T;
    /**
     * 헤더에 표시할 제목
     * ReactNode이므로 문자, HTML, 컴포넌트 모두 가능
     */
    title: ReactNode;
    /**
     * 컬럼 너비
     * 선택 속성(?)이며 문자열(String)로 지정한다.
     */
    width?: string;
    /**
     * 컬럼 정렬
     * 선택 속성(?)이며
     * left / center / right 중 하나만 가능
     */
    align?: 'left' | 'center' | 'right';
    /**
     * 셀의 기본 출력값을 원하는 형태로 변경할 때 사용
     * value : 현재 셀의 원본 값 (T[dataIndex]의 실제 타입으로 추론됨)
     * row : 현재 행 전체 데이터 (T)
     * index : 현재 행의 순서
     *
     * 예:
     * render: (value) => <strong>{value}</strong>
     *
     * 예:
     * render: (_, row) => (
     *     <Button onClick={() => handleEdit(row.id)}>
     *         수정
     *     </Button>
     * )
     */
    render?: (
        value: T[keyof T],
        row: T,
        index: number,
    ) => ReactNode;
}

/**
 * Table Props
 * T: 이 테이블이 다루는 행 데이터의 실제 타입
 */
export interface TableProps<T extends TableRow = TableRow> {
    /**
     * 테이블 컬럼 정의
     */
    columns: TableColumn<T>[];

    /**
     * 테이블 행 데이터
     */
    data: T[];

    /**
     * Empty Message
     */
    emptyMessage?: ReactNode;
    /**
     * 데이터 로딩 상태
     */
    loading?: boolean;
    /**
     * 테이블 요소에 추가할 클래스
     */
    className?: string;
}