import type { RadioProps } from './radio.types';

function Radio({
    id,
    label,
    children,
    structure = 'wrap',
    className = '',
    ...props
}: RadioProps) {
    const radioClassNameList = [
       'ui-radio',
       `ui-radio--${structure}`,
       className,
    ]
        .filter(Boolean) // 빈값 제거 = 쓸모 없는 값 청소
        .join(' ');
    
    const content = label || children;    

    if (structure === 'detached') {
        return (
            <span className={radioClassNameList}>
                <input
                id={id}
                type="radio"
                className="ui-radio__input"
                {...props}
                />
                <label
                className="ui-radio__wrapper"
                htmlFor={id}
                >
                <span className="ui-radio__control"></span>
                {content && (
                    <span className="ui-radio__label">{content}</span>
                )}
                    
                </label>
            </span>
        );
    }
    return (
        <label className={radioClassNameList}>
            <input
            id={id}
            type="radio"
            className="ui-radio__input"
            {...props}
            />
            <span className="ui-radio__control"></span>
            {content && (
                <span className="ui-radio__label">{content}</span>
            )}
        </label>
    );
}

export default Radio;