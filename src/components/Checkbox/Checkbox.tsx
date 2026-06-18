import type { CheckboxProps } from './Checkbox.types';

function Checkbox({
    id,
    label,
    children,
    structure = 'wrap',
    className = '',
    ...props
}: CheckboxProps) {
    const checkboxClassList = [
        'ui-checkbox',
        `ui-checkbox--${structure}`,
        className,
    ]
        .filter(Boolean)
        .join(' ');
    
    const content = label || children;

    if (structure === 'detached') {
        return(
            <span className={checkboxClassList}>
                <input
                id={id}
                type="checkbox"
                className="ui-checkbox__input"
                {...props}
                />

                <label className="ui-checkbox__wrapper" htmlFor={id}>
                    <span className="ui-checkbox__control"></span>
                    {content && (
                        <span className="ui-checkbox__label">{content}</span>
                    )}
                    
                </label>
            </span>
        );
    }
    return (
        <label className={checkboxClassList}>
            <input 
            id={id} 
            type="checkbox" 
            className="ui-checkbox__input" 
            {...props}
            />
            <span className="ui-checkbox__control"></span>
            {content && (
                <span className="ui-checkbox__label">{content}</span>
            )}
        </label>        
    );
}

export default Checkbox;