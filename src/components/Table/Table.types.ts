import type { ReactNode } from 'react';

/**
 * Table Column
 */
export interface TableColumn {
    // 여기서 interface : 객체의 설계도라는 걸 선언, 도면을 가져온다, TableColumn이라는 객체 도면을 만든다
    /**
     * 데이터를 찾기 위한 이름(key)
     * 문자열(String)만 사용할 수 있다.
     */
    dataIndex: string;
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
}

/**
 * Table Row
 */
export interface TableRow {
    //TableRow 라는 설계 도면을 만듬 
    // id라는 속성(property)은 반드시 있어야 하며, 그 값은 number 또는 string 중 하나여야 한다.
    id: number | string;
    // id 외에 다른 속성들을 쓸때 이름표가 되는 것들(name, date, 제목, 뱃지명 등등)
    // id 외의 다른 속성은 자유롭게 추가할 수 있다.
    // 속성의 이름(key)은 문자열(String)이어야 하며, 값(value)은 React가 화면에 렌더링할 수 있는 값(ReactNode)이어야 한다.
    // 객체 칸에 뭐든 다 들어갈 수 있다. 이름, date, 제목 등등.. 미리 정하지 않고 순간 들어오는 객체마다 다르게 불러온다.
    [key: string]: ReactNode;
}

/**
 * Table Props
 */
export interface TableProps {
    /**
     * 컬럼 정의
     */
    columns: TableColumn[];

    /**
     * 데이터
     */
    data: TableRow[];

    /**
     * Empty Message
     */
    emptyMessage?: ReactNode;
    loading?: boolean;
    /**
     * 추가 클래스
     */
    className?: string;
}