import { Input } from '../../components/Input';

const inputStates = [
    {
        title: 'Default',
        fieldClassName: '',
        props: {
        id: 'html-default',
        placeholder: '기본 상태',
        },
    },
    {
        title: 'Error',
        fieldClassName: 'is-error',
        props: {
        id: 'html-error',
        placeholder: '필수 입력 항목입니다',
        'aria-invalid': true,
        },
        message: '입력값을 확인해주세요.',
    },
    {
        title: 'Success',
        fieldClassName: 'is-success',
        props: {
        id: 'html-success',
        defaultValue: '사용 가능',
        },
        message: '사용 가능한 값입니다.',
    },
    {
        title: 'Disabled',
        fieldClassName: 'is-disabled',
        props: {
        id: 'html-disabled',
        placeholder: '입력 불가',
        disabled: true,
        },
    },
    {
        title: 'Readonly',
        fieldClassName: 'is-readonly',
        props: {
        id: 'html-readonly',
        defaultValue: '수정할 수 없는 값',
        readOnly: true,
        },
    },
] as const;

function InputPage() {
    return (
        <main className="ui-doc">
        <h1 className="ui-doc__title">Input</h1>

        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">1. HTML Input Class</h2>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Column Layout</h3>

            <div className="ui-field ui-field--column">
                <label className="ui-field__label" htmlFor="html-column">
                이름
                </label>

                <div className="ui-field__content">
                <div className="ui-input ui-input--outline ui-input--md">
                    <input
                    id="html-column"
                    className="ui-input__control"
                    type="text"
                    placeholder="이름을 입력하세요"
                    />
                </div>

                <div className="ui-field__meta">
                    <p className="ui-field__message">이름을 입력해주세요.</p>
                </div>
                </div>
            </div>
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Row Layout</h3>

            <div className="ui-field ui-field--row">
                <label className="ui-field__label" htmlFor="html-row">
                이메일
                </label>

                <div className="ui-field__content">
                <div className="ui-input ui-input--outline ui-input--md">
                    <input
                    id="html-row"
                    className="ui-input__control"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    />
                </div>

                <div className="ui-field__meta">
                    <p className="ui-field__message">
                    이메일 형식으로 입력해주세요.
                    </p>
                </div>
                </div>
            </div>
            </div>

            {inputStates.map(({ title, fieldClassName, props, message }) => (
            <div key={title} className="ui-doc__group">
                <h3 className="ui-doc__group-title">{title}</h3>

                <div className={`ui-field ui-field--column ${fieldClassName}`}>
                <label className="ui-field__label" htmlFor={props.id}>
                    {title}
                </label>

                <div className="ui-field__content">
                    <div className="ui-input ui-input--outline ui-input--md">
                    <input
                        {...props}
                        className="ui-input__control"
                        type="text"
                    />
                    </div>

                    {message && (
                    <div className="ui-field__meta">
                        <p className="ui-field__message">{message}</p>
                    </div>
                    )}
                </div>
                </div>
            </div>
            ))}
        </section>

        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">2. React Input Component</h2>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Column Layout</h3>

            <Input
                id="react-column"
                label="이름"
                placeholder="이름을 입력하세요"
                helperText="이름을 입력해주세요."
            />
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Row Layout</h3>

            <Input
                id="react-row"
                layout="row"
                label="이메일"
                type="email"
                placeholder="이메일을 입력하세요"
                helperText="이메일 형식으로 입력해주세요."
            />
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">State</h3>

            <Input
                id="react-default"
                label="Default"
                placeholder="기본 상태"
            />

            <Input
                id="react-error"
                label="Error"
                state="error"
                placeholder="필수 입력 항목입니다"
                helperText="입력값을 확인해주세요."
            />

            <Input
                id="react-success"
                label="Success"
                state="success"
                defaultValue="사용 가능"
                helperText="사용 가능한 값입니다."
            />

            <Input
                id="react-disabled"
                label="Disabled"
                placeholder="입력 불가"
                disabled
            />

            <Input
                id="react-readonly"
                label="Readonly"
                defaultValue="수정할 수 없는 값"
                readOnly
            />
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Addon / Counter</h3>

            <Input
                id="react-price"
                label="금액"
                placeholder="금액 입력"
                prefix="₩"
                suffix="원"
            />

            <Input
                id="react-counter"
                label="닉네임"
                defaultValue="입력값"
                helperText="최대 10자까지 입력 가능합니다."
                counter="3 / 10"
                clearable
            />
            </div>
        </section>
        </main>
    );
}

export default InputPage;



/**
 * ========================================
 * React 공부 메모
 * ========================================
 *
 * Props
 * = 컴포넌트에 전달하는 정보
 *
 * 예)
 *
 * <Input
 *   label="이름"
 *   disabled
 * />
 *
 * ↓
 *
 * props = {
 *   label: '이름',
 *   disabled: true
 * }
 *
 * ----------------------------------------
 *
 * map()
 * = 배열 반복 + JSX 생성
 *
 * 예)
 *
 * const fruits = [
 *   '사과',
 *   '바나나',
 *   '포도'
 * ];
 *
 * fruits.map((fruit) => (
 *   <div>{fruit}</div>
 * ))
 *
 * ↓
 *
 * <div>사과</div>
 * <div>바나나</div>
 * <div>포도</div>
 *
 * ----------------------------------------
 *
 * ReactNode
 * = 화면에 표시할 수 있는 모든 것
 *
 * 문자열
 * 태그
 * 컴포넌트
 *
 * ----------------------------------------
 *
 * children
 * = 태그 사이 내용
 *
 * <Button>
 *   저장
 * </Button>
 *
 * ↓
 *
 * children = '저장'
 *
 * ----------------------------------------
 *
 * ...props
 * = 나머지 정보 전부 전달
 *
 * <Input
 *   placeholder="이름 입력"
 *   maxLength={20}
 * />
 *
 * ↓
 *
 * <input
 *   placeholder="이름 입력"
 *   maxLength="20"
 * />
 */