import type { ReactNode } from 'react';

export type ModalSize =
    | 'sm'
    | 'md'
    | 'lg';

export interface ModalProps {
    // Modal은 input처럼 HTML 기본 속성 상속이 필요하지 않음
    // 여러 영역을 조립하는 레이아웃 컴포넌트라서 필요한 props만 직접 정의하면 됨
    open: boolean; // 모달 열림 여부
    title?: ReactNode; // header 제목
    children?: ReactNode; // body 내용
    footer?: ReactNode; // footer 영역
    size?: ModalSize; // sm / md / lg
    onClose?: () => void; // 닫기 버튼 클릭시 실행할 함수
    className?: string; // ui-modal 추가 클래스
    panelClassName?: string; // ui-modal__panel 추가 클래스
}