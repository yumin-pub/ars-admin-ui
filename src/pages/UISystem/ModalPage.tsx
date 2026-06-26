import { useState } from 'react';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Checkbox } from '../../components/Checkbox';
import { Modal } from '../../components/Modal';

function ModalPage() {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isNoFooterOpen, setIsNoFooterOpen] = useState(false);
    /* =======================
    isAlertOpen = 현재 모달이 열렸는지 여부
    setIsAlertOpen = 그 값을 바꾸는 함수
    false = 처음에는 닫힘 
    =======================*/
    return (
        <main className="ui-doc">
        <h1 className="ui-doc__title">Modal</h1>

        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">1. HTML Modal Class</h2>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Alert Modal</h3>
            {/* <div className="ui-modal is-open"> */}
            <div className="ui-modal">
                <div className="ui-modal__dimmed"></div>

                <section
                className="ui-modal__panel ui-modal__panel--sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-alert-title"
                >
                <header className="ui-modal__header">
                    <h2 id="modal-alert-title" className="ui-modal__title">
                    저장 완료
                    </h2>

                    <button type="button" className="ui-modal__close" aria-label="모달 닫기">
                    ×
                    </button>
                </header>

                <div className="ui-modal__body">
                    <p>저장되었습니다.</p>
                </div>

                <footer className="ui-modal__footer">

                </footer>
                </section>
            </div>
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Body Actions / No Footer</h3>

            {/* <div className="ui-modal is-open"> */}
            <div className="ui-modal">
                <div className="ui-modal__dimmed"></div>

                <section
                className="ui-modal__panel ui-modal__panel--md"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-body-action-title"
                >
                <header className="ui-modal__header">
                    <h2 id="modal-body-action-title" className="ui-modal__title">
                    안내
                    </h2>

                    <button type="button" className="ui-modal__close" aria-label="모달 닫기">
                    ×
                    </button>
                </header>

                <div className="ui-modal__body">
                    <p>footer 없이 body 내부에 버튼을 배치한 예시입니다.</p>

                    <div className="ui-modal__actions">
                    <Button variant="solid" color="primary" size="md">
                        확인
                    </Button>
                    </div>
                </div>
                </section>
            </div>
            </div>
        </section>
        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">
                2. React Modal Component
            </h2>

            <div className="ui-doc__group">
                <h3 className="ui-doc__group-title">
                    Alert Modal
                </h3>
                <Button
                    variant='solid'
                    color='primary'
                    size='md'
                    onClick={() => setIsAlertOpen(true) }
                    >
                    Alert Modal 열기
                </Button>
                <Modal
                    open={isAlertOpen}
                    title="저장 완료"
                    size="sm"
                    onClose={() => setIsAlertOpen(false)}
                    footer={
                        <Button
                            variant="solid"
                            color="primary"
                            size="md"
                            onClick={() => setIsAlertOpen(false)}
                        >
                            확인
                        </Button>
                    }
                >
                    <p>저장되었습니다.</p>
                </Modal>
            </div>

            <div className="ui-doc__group">
                <h3 className="ui-doc__group-title">
                    Confirm Modal
                </h3>
                <Button
                    variant="solid"
                    color="primary"
                    size="md"
                    onClick={() => setIsConfirmOpen(true)}
                >
                    버튼클릭
                </Button>
                <Modal
                    open={isConfirmOpen}
                    title="삭제 확인"
                    size="sm"
                    onClose={() => setIsConfirmOpen(false)}
                    footer={
                        <>
                            <Button
                                variant="outline"
                                color="secondary"
                                size="md"
                            >
                                취소
                            </Button>

                            <Button
                                variant="solid"
                                color="primary"
                                size="md"
                                onClick={() => setIsConfirmOpen(false)}
                            >
                                확인
                            </Button>
                        </>
                    }
                >
                    <p>삭제하시겠습니까?</p>
                </Modal>
            </div>

            <div className="ui-doc__group">
                <h3 className="ui-doc__group-title">
                    Form Modal
                </h3>
                <Button
                    variant='solid'
                    color='primary'
                    size='md'
                    onClick={() => setIsFormOpen(true)}
                >
                    버튼클릭
                </Button>
                <Modal
                    open={isFormOpen}
                    title="공지 등록"
                    size="lg"
                    onClose={() => setIsFormOpen(false)}
                    footer={
                        <>
                            <Button
                                variant="outline"
                                color="secondary"
                                size="md"
                            >
                                취소
                            </Button>

                            <Button
                                variant="solid"
                                color="primary"
                                size="md"
                                onClick={() => setIsFormOpen(false)}
                            >
                                저장
                            </Button>
                        </>
                    }
                >
                    <Input
                        id="modal-title"
                        label="제목"
                        placeholder="제목을 입력하세요."
                    />

                    <Select
                        id="modal-category"
                        label="분류"
                        options={[
                            {
                                label: '공지',
                                value: 'notice',
                            },
                            {
                                label: '이벤트',
                                value: 'event',
                            },
                        ]}
                    />

                    <Checkbox
                        id="modal-fixed"
                        label="상단 고정"
                    />
                </Modal>
            </div>

            <div className="ui-doc__group">
                <h3 className="ui-doc__group-title">
                    Body Actions
                </h3>
                <Button
                    variant='solid'
                    size='md'
                    color='primary'
                    onClick={() => setIsNoFooterOpen(true)}
                >
                    버튼 클릭
                </Button>
                <Modal
                    open={isNoFooterOpen}
                    title="안내"
                    size="md"
                    onClose={() => setIsNoFooterOpen(false)}
                >
                    <p>
                        footer 없이 body 내부에서 버튼을 사용하는 예시입니다.
                    </p>

                    <div className="ui-modal__actions">
                        <Button
                            variant="solid"
                            color="primary"
                            size="md"
                            onClick={() => setIsNoFooterOpen(false)}
                        >
                            확인
                        </Button>
                    </div>
                </Modal>
            </div>
        </section>
        </main>
    );
}

export default ModalPage;