import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import type { ModalProps } from '../../../components/Modal';
import { Select } from '../../../components/Select';

type ModalExampleType =
    | 'alert'
    | 'confirm'
    | 'form'
    | 'body-actions'
    | 'no-footer'
    | null;

function ModalPlayground({
    open: controlledOpen,
    title,
    size,
}: ModalProps) {
    const [open, setOpen] = useState(controlledOpen);

    useEffect(() => {
        setOpen(controlledOpen);
    }, [controlledOpen]);

    const closeModal = () => {
        setOpen(false);
    };

    const openModal = () => {
        setOpen(true);
    };

    return (
        <div
            style={{
                minHeight: '500px',
                padding: '32px',
            }}
        >
            <Button onClick={openModal}>
                Modal 열기
            </Button>

            <Modal
                open={open}
                title={title}
                size={size}
                onClose={closeModal}
                footer={
                    <>
                        <Button
                            variant="outline"
                            color="neutral"
                            onClick={closeModal}
                        >
                            취소
                        </Button>

                        <Button onClick={closeModal}>
                            확인
                        </Button>
                    </>
                }
            >
                <p>
                    Modal Body Content
                </p>
            </Modal>
        </div>
    );
}

function ModalExamples() {
    const [activeModal, setActiveModal] =
        useState<ModalExampleType>(null);

    const closeModal = () => {
        setActiveModal(null);
    };

    const openModal = (modalType: ModalExampleType) => {
        setActiveModal(modalType);
    };

    const handleConfirm = () => {
        closeModal();
    };

    const handleSave = () => {
        closeModal();
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                minHeight: '700px',
                padding: '32px',
            }}
        >
            <section>
                <h3
                    style={{
                        marginBottom: '12px',
                    }}
                >
                    Alert Modal
                </h3>

                <Button onClick={() => openModal('alert')}>
                    Alert Modal 열기
                </Button>
            </section>

            <section>
                <h3
                    style={{
                        marginBottom: '12px',
                    }}
                >
                    Confirm Modal
                </h3>

                <Button onClick={() => openModal('confirm')}>
                    Confirm Modal 열기
                </Button>
            </section>

            <section>
                <h3
                    style={{
                        marginBottom: '12px',
                    }}
                >
                    Form Modal
                </h3>

                <Button onClick={() => openModal('form')}>
                    Form Modal 열기
                </Button>
            </section>

            <section>
                <h3
                    style={{
                        marginBottom: '12px',
                    }}
                >
                    Body Actions
                </h3>

                <Button onClick={() => openModal('body-actions')}>
                    Body Actions 열기
                </Button>
            </section>

            <section>
                <h3
                    style={{
                        marginBottom: '12px',
                    }}
                >
                    No Footer
                </h3>

                <Button onClick={() => openModal('no-footer')}>
                    No Footer 열기
                </Button>
            </section>

            <Modal
                open={activeModal === 'alert'}
                title="저장 완료"
                size="sm"
                onClose={closeModal}
                footer={
                    <Button onClick={closeModal}>
                        확인
                    </Button>
                }
            >
                <p>
                    저장되었습니다.
                </p>
            </Modal>

            <Modal
                open={activeModal === 'confirm'}
                title="삭제 확인"
                size="sm"
                onClose={closeModal}
                footer={
                    <>
                        <Button
                            variant="outline"
                            color="neutral"
                            onClick={closeModal}
                        >
                            취소
                        </Button>

                        <Button
                            color="primary"
                            onClick={handleConfirm}
                        >
                            확인
                        </Button>
                    </>
                }
            >
                <p>
                    선택한 항목을 삭제하시겠습니까?
                </p>
            </Modal>

            <Modal
                open={activeModal === 'form'}
                title="공지 등록"
                size="md"
                onClose={closeModal}
                footer={
                    <>
                        <Button
                            variant="outline"
                            color="neutral"
                            onClick={closeModal}
                        >
                            취소
                        </Button>

                        <Button
                            color="primary"
                            onClick={handleSave}
                        >
                            저장
                        </Button>
                    </>
                }
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}
                >
                    <Input
                        id="modal-title"
                        label="공지 제목"
                        placeholder="공지 제목을 입력하세요."
                    />

                    <Select
                        id="modal-category"
                        label="공지 구분"
                        options={[
                            {
                                label: '공지 구분을 선택하세요.',
                                value: '',
                            },
                            {
                                label: '일반 공지',
                                value: 'general',
                            },
                            {
                                label: '긴급 공지',
                                value: 'emergency',
                            },
                            {
                                label: '시스템 공지',
                                value: 'system',
                            },
                        ]}
                    />

                    <Input
                        id="modal-writer"
                        label="작성자"
                        placeholder="작성자를 입력하세요."
                    />

                    <Checkbox
                        id="modal-important"
                        label="중요 공지로 등록"
                    />
                </div>
            </Modal>

            <Modal
                open={activeModal === 'body-actions'}
                title="Body Actions"
                size="md"
                onClose={closeModal}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                    }}
                >
                    <p>
                        Footer를 사용하지 않고 Body 영역에 버튼을 배치한
                        예시입니다.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                        }}
                    >
                        <Button
                            variant="outline"
                            color="neutral"
                            onClick={closeModal}
                        >
                            취소
                        </Button>

                        <Button onClick={closeModal}>
                            확인
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                open={activeModal === 'no-footer'}
                title="No Footer"
                size="md"
                onClose={closeModal}
            >
                <p>
                    Footer 영역 없이 Header와 Body만 사용하는 모달입니다.
                </p>
            </Modal>
        </div>
    );
}

const meta: Meta<typeof Modal> = {
    title: 'Components/Modal',
    component: Modal,

    parameters: {
        layout: 'fullscreen',
    },

    argTypes: {
        open: {
            control: 'boolean',
        },

        title: {
            control: 'text',
        },

        size: {
            control: 'inline-radio',
            options: ['sm', 'md', 'lg'],
        },

        children: {
            control: false,
        },

        footer: {
            control: false,
        },

        onClose: {
            control: false,
        },

        className: {
            control: false,
        },

        panelClassName: {
            control: false,
        },
    },

    args: {
        open: true,
        title: 'Modal Title',
        size: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Playground: Story = {
    render: (args) => (
        <ModalPlayground {...args} />
    ),
};

export const Examples: Story = {
    render: () => (
        <ModalExamples />
    ),

    parameters: {
        controls: {
            disable: true,
        },
    },
};