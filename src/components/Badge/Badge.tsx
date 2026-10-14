import type { BadgeProps } from './Badge.types';

function Badge({
    children,
    variant = 'neutral',
    className = '',
    ...props
}: BadgeProps) {
    const badgeClassName = [
        'ui-badge',
        `ui-badge--${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span
            className={badgeClassName}
            {...props}
        >
            {children}
        </span>
    );
}

export default Badge;
