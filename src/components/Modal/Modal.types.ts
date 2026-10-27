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
    onClose?: () => void; // 닫기 버튼, ESC, 딤 클릭 시 실행할 함수
    closeOnEsc?: boolean; // ESC 키로 닫기 (기본 true)
    closeOnDimmed?: boolean; // 딤 영역 클릭으로 닫기 (기본 true)
    className?: string; // ui-modal 추가 클래스
    panelClassName?: string; // ui-modal__panel 추가 클래스

    // 패널의 role (선택, 기본 'dialog')
    // 삭제 확인처럼 사용자의 응답이 꼭 필요한 경고·확인 대화상자는 'alertdialog'를 쓴다.
    role?: ModalRole;

    // 설명문 요소의 id (선택). 지정하면 패널에 aria-describedby로 연결된다. 지정하지 않으면 기존 DOM과 같다.
    // alertdialog는 무엇을 확인하는지 설명문을 연결하는 것이 권장된다.
    ariaDescribedBy?: string;
}

export type ModalRole =
    | 'dialog'
    | 'alertdialog';
