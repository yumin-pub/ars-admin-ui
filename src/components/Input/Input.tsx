import type { InputProps } from './Input.types';

function Input({
    id,
    label,
    helperText,
    counter,
    variant = 'outline',
    size = 'md',
    layout = 'column',
    state = 'default',
    prefix,
    suffix,
    clearable = false,
    disabled,
    readOnly,
    className = '',
    fieldClassName = '',
    inputClassName = '',
    ...props
    }: InputProps) {
    const fieldClassNameList = [
        'ui-field',
        `ui-field--${layout}`,
        state !== 'default' && `is-${state}`,
        disabled && 'is-disabled',
        readOnly && 'is-readonly',
        fieldClassName,
    ]
        .filter(Boolean)
        .join(' ');

    const inputClassNameList = [
        'ui-input',
        `ui-input--${variant}`,
        `ui-input--${size}`,
        inputClassName,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={fieldClassNameList}>
        <div className="ui-field__content">
            {label && (
            <label className="ui-field__label" htmlFor={id}>
                {label}
            </label>
            )}

            <div className={inputClassNameList}>
            {prefix && <span className="ui-input__prefix">{prefix}</span>}

            <input
                id={id}
                className={['ui-input__control', className]
                .filter(Boolean)
                .join(' ')}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={state === 'error'}
                {...props}
            />

            {clearable && (
                <button
                type="button"
                className="ui-input__clear"
                aria-label="입력값 삭제"
                >
                ×
                </button>
            )}

            {suffix && <span className="ui-input__suffix">{suffix}</span>}
            </div>

            {(helperText || counter) && (
            <div className="ui-field__meta">
                {helperText && (
                <p className="ui-field__message">{helperText}</p>
                )}

                {counter && (
                <span className="ui-field__counter">{counter}</span>
                )}
            </div>
            )}
        </div>
        </div>
    );
}

export default Input;

/**
 * React 공부 메모
 *
 * ReactNode
 * = 문자, 태그, 컴포넌트 모두 가능
 *
 * ?:
 * = 선택값(Optional)
 *
 * extends InputHTMLAttributes<HTMLInputElement>
 * = React 기본 input 속성 상속
 *
 * clearable?: boolean
 * = 삭제 버튼 표시 여부
 *
 * fieldClassName
 * = ui-field 추가 클래스
 *
 * inputClassName
 * = ui-input 추가 클래스
 *
 * {label && (...) }
 * = 값이 있을 때만 렌더링
 *
 * .filter(Boolean)
 * = 빈값 제거
 *
 * .join(' ')
 * = class 문자열 생성
 *
 * ...props
 * = 전달받은 나머지 props 전달
 *
 * aria-invalid
 * = 접근성용 오류 상태 표시
 */

/**
 * Input.tsx 흐름
 *
 * Props 받기
 * ↓
 * className 조립
 * ↓
 * label / input / message 조건부 렌더링
 * ↓
 * 최종 HTML 생성
 */