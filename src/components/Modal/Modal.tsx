import type { ModalProps } from './Modal.types';

function Modal({
    open,
	title,
	children,
	footer,
	size = 'md',
	onClose,
	className = '',
	panelClassName = '',
	// ...props  // 모달에서는 깨낼 정보값이 없으므로 안 써줌
	// props= 컴포넌트에게 주는 정보값, ...props = 내가 아직 안 꺼낸 나머지 정보값
}:ModalProps) {
	if (!open) {
		/* open이 false면 아무것도 그리지 마. */
		return null
		
	}
	const modalClassList = [
		'ui-modal',
		'is-open',
		className
	]
		.filter(Boolean)
		.join(' ');
	const panelClassNameList = [
		'ui-modal__panel',
		`ui-modal__panel--${size}`,
		panelClassName,
	]
		.filter(Boolean)
		.join(' ');       
	return (
		<div className={modalClassList}>
			<div className="ui-modal__dimmed"></div>

			<section
				className={panelClassNameList}
				role="dialog"
				aria-modal="true"
			>
				<header className="ui-modal__header">
					<h2 className="ui-modal__title">
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

				<div className="ui-modal__body">
					{children}
				</div>

				{footer && (
					<footer className="ui-modal__footer">
						{footer}
					</footer>
				)}
			</section>
		</div>
	)
}
export default Modal;