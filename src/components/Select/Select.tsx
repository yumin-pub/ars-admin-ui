import type { SelectProps } from './Select.types';

function Select({ //Select 컴포넌트가 사용할 정보값을 꺼내온다.
    id,
    label,
    helperText,
    options = [], //options가 없으면 배열
    variant = 'outline', //variant가 없으면 outline
    SelectSize = 'md', //size가 없으면 md
    state = 'default', //state가 없으면 default
    disabled,
    className = '',
    fieldClassName = '',
    selectClassName = '',  
    ...props
    }: SelectProps) { //여기까지 props 받기
    const fieldClassNameList = [// field 클래스 만들기
        'ui-select-field', //클래스 생성
        state !== 'default' && `is-${state}`,
        disabled && 'is-disabled',
        fieldClassName, //추가 클래스가 있으면 같이 붙임
    ]
        .filter(Boolean)
        .join(' ');
    
    const selectClassNameList = [ // select 박스 클래스 생성
        'ui-select',
        `ui-select--${variant}`,
        `ui-select--${SelectSize}`,
        selectClassName,
    ]
        .filter(Boolean)
        .join(' ');   
    return (
        <div className={fieldClassNameList}>
            {label && ( //조건부 렌더링 : 라벨 값이 있을 때만 출력
            <label className="ui-select-field__label" htmlFor={id}>
                {label}
            </label>
            )}
            <div className={selectClassNameList}> {/* 실제 select 박스 wrapper */}
                <select // select 영역 : select 생성
                    id={id}
                    className={['ui-select__control', className]
                        .filter(Boolean)
                        .join(' ')}
                    disabled={disabled}
                    aria-invalid={state === 'error'}
                    {...props} //나머지 props 전달
                >
                    {options.map((option) => (  //옵션 배열을 반복
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}
                </select>    
            </div>
            {helperText && ( //helperText가 있을 때만 출력
                <p className="ui-select-field__message">
                    {helperText}
                </p>
            )}
        </div>
    );
}

export default Select;