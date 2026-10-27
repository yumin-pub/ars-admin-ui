// import { useEffect, useState } from 'react';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';

import type { Meta, StoryObj } from '@storybook/react-vite';

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

// useArgs는 스토리 함수(render) 안에서만 호출할 수 있다.
// 그래서 ModalPlayground는 값과 함수를 props로 받기만 한다.
interface ModalPlaygroundProps extends ModalProps {
    onOpen: () => void;
}

function ModalPlayground({
    open,
    title,
    size,
    closeOnEsc,
    closeOnDimmed,
    onOpen: openModal,
    onClose: closeModal,
}: ModalPlaygroundProps) {
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
                closeOnEsc={closeOnEsc}
                closeOnDimmed={closeOnDimmed}
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
                <p>Modal Body Content</p>
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

        closeOnEsc: {
            control: 'boolean',
        },

        closeOnDimmed: {
            control: 'boolean',
        },

        className: {
            control: false,
        },

        panelClassName: {
            control: false,
        },

        role: {
            control: 'inline-radio',
            options: ['dialog', 'alertdialog'],
            description: "패널의 role. 삭제 확인처럼 응답이 꼭 필요한 경고·확인에는 'alertdialog'",
        },

        ariaDescribedBy: {
            control: 'text',
            description: '설명문 요소의 id. 지정하면 패널의 aria-describedby로 연결된다',
        },
    },

    args: {
        open: false,
        title: 'Modal Title',
        size: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Playground: Story = {
    render: function PlaygroundRender(args) {
        const [, updateArgs] = useArgs();

        return (
            <ModalPlayground
                {...args}
                onOpen={() => updateArgs({ open: true })}
                onClose={() => updateArgs({ open: false })}
            />
        );
    },
};

/**
 * 삭제 확인 (role="alertdialog" + ariaDescribedBy)
 * 기본 포커스가 "취소"에 가도록 footer에 취소를 먼저 둔다. 딤 클릭으로는 닫지 않는다.
 */
function AlertDialogExample() {
    const [open, setOpen] = useState(false);
    const descriptionId = 'modal-alertdialog-description';

    return (
        <div style={{ minHeight: '400px', padding: '32px' }}>
            <Button variant="outline" color="neutral" onClick={() => setOpen(true)}>
                삭제
            </Button>

            <Modal
                open={open}
                title="게시글 삭제"
                size="sm"
                role="alertdialog"
                ariaDescribedBy={descriptionId}
                closeOnDimmed={false}
                onClose={() => setOpen(false)}
                footer={(
                    <>
                        <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
                            취소
                        </Button>
                        <Button color="danger" onClick={() => setOpen(false)}>
                            삭제
                        </Button>
                    </>
                )}
            >
                <p id={descriptionId}>
                    &apos;공지사항&apos; 게시글을 삭제할까요? 삭제하면 목록에서 바로 사라집니다.
                </p>
            </Modal>
        </div>
    );
}

export const AlertDialog: Story = {
    render: () => <AlertDialogExample />,

    parameters: {
        controls: {
            disable: true,
        },
    },
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
