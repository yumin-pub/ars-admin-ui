import type { LoadingProps } from './Loading.types';

export default function Loading({
    overlay = true,
    size = 'md',
    message = '데이터를 불러오는 중입니다.',
    description = '잠시만 기다려 주세요.',
    className = '',
}: LoadingProps) {
    const classNames = [
        'ui-loading',
        `ui-loading--${size}`,
        overlay && 'ui-loading--overlay',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classNames}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="ui-loading__panel">
                <span className="ui-loading__spinner" aria-hidden="true" />

                {(message || description) && (
                    <div className="ui-loading__content">
                        {message && (
                            <p className="ui-loading__message">
                                {message}
                            </p>
                        )}

                        {description && (
                            <p className="ui-loading__description">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}