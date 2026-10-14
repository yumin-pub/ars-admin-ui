import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

import type { ModalProps } from './Modal.types';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(root: HTMLElement | null) {
    if (!root) return [];

    return Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
}

function Modal({
    open,
    title,
    children,
    footer,
    size = 'md',
    onClose,
    closeOnEsc = true,
    closeOnDimmed = true,
    className = '',
    panelClassName = '',
}: ModalProps) {
    const titleId = useId();
    const panelRef = useRef<HTMLElement>(null);

    // onClose가 렌더마다 새로 만들어져도 effect가 다시 실행되지 않도록 ref에 보관
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    // 열릴 때: 스크롤 잠금 + 포커스 이동 / 닫힐 때: 원복 + 포커스 복귀
    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const panel = panelRef.current;
        const initialTarget =
            getFocusable(panel?.querySelector<HTMLElement>('.ui-modal__body') ?? null)[0] ??
            getFocusable(panel?.querySelector<HTMLElement>('.ui-modal__footer') ?? null)[0] ??
            getFocusable(panel)[0] ??
            panel;
        initialTarget?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open]);

    // ESC 닫기
    useEffect(() => {
        if (!open || !closeOnEsc) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onCloseRef.current?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, closeOnEsc]);

    // Tab 키가 모달 밖으로 나가지 않도록 포커스 가둠
    const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Tab') return;

        const focusable = getFocusable(panelRef.current);

        if (focusable.length === 0) {
            event.preventDefault();
            panelRef.current?.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && (active === first || active === panelRef.current)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };

    if (!open) {
        /* open이 false면 아무것도 그리지 않는다. */
        return null;
    }

    const modalClassList = ['ui-modal', 'is-open', className]
        .filter(Boolean)
        .join(' ');

    const panelClassNameList = [
        'ui-modal__panel',
        `ui-modal__panel--${size}`,
        panelClassName,
    ]
        .filter(Boolean)
        .join(' ');

    return createPortal(
        <div className={modalClassList}>
            <div
                className="ui-modal__dimmed"
                aria-hidden="true"
                onClick={closeOnDimmed ? onClose : undefined}
            />

            <section
                ref={panelRef}
                className={panelClassNameList}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
                onKeyDown={handlePanelKeyDown}
            >
                <header className="ui-modal__header">
                    <h2 id={titleId} className="ui-modal__title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="ui-modal__close"
                        aria-label="모달 닫기"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                <div className="ui-modal__body">{children}</div>

                {footer && (
                    <footer className="ui-modal__footer">{footer}</footer>
                )}
            </section>
        </div>,
        document.body,
    );
}

export default Modal;
