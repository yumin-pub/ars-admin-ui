import { useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

import type { PostRow } from '../../api/posts';

import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

/**
 * 여러 건 삭제일 때 목록으로 보여줄 제목 수 (나머지는 "외 N건")
 */
const MAX_LISTED_TITLES = 5;

export interface DeleteConfirmModalProps {
    /**
     * 삭제할 행 (1건이면 그 제목으로, 여러 건이면 건수로 묻는다)
     */
    rows: readonly PostRow[];

    /**
     * "삭제"를 눌렀을 때. 모달은 이 직후 바로 닫힌다. (낙관적 반영)
     */
    onConfirm: () => void;

    /**
     * 닫기 (취소·ESC·닫기 버튼·삭제 후)
     */
    onClose: () => void;
}

/**
 * 버튼에서 길게 누른 Enter(키 반복)는 무시한다.
 * 확정이 두 번 일어나거나, "취소"로 닫힌 뒤 반복 Enter가 삭제 버튼으로 돌아가 모달이 다시 열리지 않게 한다.
 */
function ignoreRepeatedEnter(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' && event.repeat) event.preventDefault();
}

/**
 * 게시글 삭제 확인 (role="alertdialog")
 * - 기본 포커스는 "취소"다. (Footer에 먼저 둔다. Enter를 잘못 눌러도 지워지지 않게)
 *   이 보장은 Modal의 초기 포커스 규칙(본문 → Footer 순서로 첫 포커스 가능 요소)에 기대고 있다.
 *   본문에 링크·버튼·tabIndex 요소를 넣으면 기본 포커스가 그쪽으로 가서 "안전한 쪽에 기본 포커스"가 깨지므로,
 *   본문에는 포커스 가능한 요소를 두지 않는다.
 * - 바깥(딤) 클릭으로는 닫지 않는다. ESC는 취소와 같다.
 * - "삭제"는 한 번만 확정한다. 연타·길게 누름은 무시한다.
 * - 취소·닫기 후 포커스는 Modal이 열기 전 포커스(눌렀던 삭제 버튼)로 돌려준다.
 */
function DeleteConfirmModal({ rows, onConfirm, onClose }: DeleteConfirmModalProps) {
    const baseId = useId();
    const descriptionId = `${baseId}-description`;
    const listId = `${baseId}-list`;

    // 한 번 확정하면 다시 확정하지 않는다. (state는 다음 렌더까지 반영되지 않아 ref로 막는다)
    const confirmedRef = useRef(false);

    const isSingle = rows.length === 1;
    const listed = rows.slice(0, MAX_LISTED_TITLES);
    const restCount = rows.length - listed.length;

    const handleConfirm = () => {
        if (confirmedRef.current) return;
        confirmedRef.current = true;

        onConfirm();
        onClose();
    };

    return (
        <Modal
            open
            size="sm"
            role="alertdialog"
            title={isSingle ? '게시글 삭제' : '선택한 게시글 삭제'}
            ariaDescribedBy={isSingle ? descriptionId : `${descriptionId} ${listId}`}
            onClose={onClose}
            closeOnDimmed={false}
            footer={(
                <>
                    <Button variant="outline" color="neutral" onClick={onClose} onKeyDown={ignoreRepeatedEnter}>
                        취소
                    </Button>
                    <Button color="danger" onClick={handleConfirm} onKeyDown={ignoreRepeatedEnter}>
                        삭제
                    </Button>
                </>
            )}
        >
            <p id={descriptionId} className="ui-posts__confirm-message">
                {isSingle
                    ? `'${rows[0].title}' 게시글을 삭제할까요? 삭제하면 목록에서 바로 사라집니다.`
                    : `선택한 게시글 ${rows.length}건을 삭제할까요? 삭제하면 목록에서 바로 사라집니다.`}
            </p>

            {!isSingle && (
                <ul id={listId} className="ui-posts__confirm-list">
                    {listed.map((row) => (
                        <li key={row.id}>{row.title}</li>
                    ))}
                    {restCount > 0 && <li>외 {restCount}건</li>}
                </ul>
            )}
        </Modal>
    );
}

export default DeleteConfirmModal;
