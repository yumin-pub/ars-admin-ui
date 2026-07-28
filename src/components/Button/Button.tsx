import type { ButtonProps } from './Button.types';

function Button({
	children,
	variant = 'solid',
	color = 'primary',
	size = 'md',
	type = 'button',
	className = '',
	...props
}: ButtonProps) {
	const buttonClassName = [
		'ui-btn',
		`ui-btn--${variant}`,
		`ui-btn--${color}`,
		`ui-btn--${size}`,
		className,
	]
    .filter(Boolean)
    .join(' ');

	return (
		<button
		type={type}
		className={buttonClassName}
		{...props}
		>
		{children}
		</button>
	);
}

export default Button;