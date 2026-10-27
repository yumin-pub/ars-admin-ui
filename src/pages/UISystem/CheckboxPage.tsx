import { Checkbox } from '../../components/Checkbox';

/**
 * 일부 선택(indeterminate)은 HTML 속성이 아니라 DOM 속성이라 마크업만으로는 줄 수 없다.
 * 예제에서는 콜백 ref로 input.indeterminate = true를 준다. (HTML만 쓰는 화면에서는 JS로 같은 값을 준다)
 */
function setIndeterminate(input: HTMLInputElement | null) {
    if (input) input.indeterminate = true;
}

function CheckboxPage() {
    return (
        <main className="ui-doc">
        <h1 className="ui-doc__title">Checkbox</h1>

        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">1. HTML Checkbox Class</h2>
            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Label Wrap</h3>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Default</span>
            </label>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" defaultChecked />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Checked</span>
            </label>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" disabled />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Disabled</span>
            </label>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" defaultChecked disabled />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Checked Disabled</span>
            </label>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input
                type="checkbox"
                className="ui-checkbox__input"
                aria-label="라벨 없는 체크박스"
                />
                <span className="ui-checkbox__control"></span>
            </label>
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Detached Label</h3>
            <span className="ui-checkbox ui-checkbox--detached">
                <input
                id="checkbox-default"
                type="checkbox"
                className="ui-checkbox__input"
                />

                <label className="ui-checkbox__wrapper" htmlFor="checkbox-default">
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Default</span>
                </label>
            </span>
            <span className="ui-checkbox ui-checkbox--detached">
                <input
                id="checkbox-checked"
                type="checkbox"
                className="ui-checkbox__input"
                defaultChecked
                />
                <label className="ui-checkbox__wrapper" htmlFor="checkbox-checked">
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Checked</span>
                </label>
            </span>

            <span className="ui-checkbox ui-checkbox--detached">
                <input
                id="checkbox-disabled"
                type="checkbox"
                className="ui-checkbox__input"
                disabled
                />
                <label className="ui-checkbox__wrapper" htmlFor="checkbox-disabled">
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Disabled</span>
                </label>
            </span>
            <span className="ui-checkbox ui-checkbox--detached">
                <input
                id="checkbox-checked-disabled"
                type="checkbox"
                className="ui-checkbox__input"
                defaultChecked
                disabled
                />
                <label className="ui-checkbox__wrapper" htmlFor="checkbox-checked-disabled">
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Checked Disabled</span>
                </label>
            </span>

            <span className="ui-checkbox ui-checkbox--detached">
                <input
                id="checkbox-no-label"
                type="checkbox"
                className="ui-checkbox__input"
                aria-label="라벨 없는 체크박스"
                />
                <label className="ui-checkbox__wrapper" htmlFor="checkbox-no-label">
                <span className="ui-checkbox__control"></span>
                </label>
            </span>
            </div>

            <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Indeterminate (일부 선택, JS로 input.indeterminate = true)</h3>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" ref={setIndeterminate} />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Indeterminate</span>
            </label>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" ref={setIndeterminate} disabled />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Indeterminate Disabled</span>
            </label>
            <label className="ui-checkbox ui-checkbox--wrap">
                <input type="checkbox" className="ui-checkbox__input" ref={setIndeterminate} defaultChecked />
                <span className="ui-checkbox__control"></span>
                <span className="ui-checkbox__label">Indeterminate + Checked</span>
            </label>
            </div>
        </section>
        <section className="ui-doc__section">
        <h2 className="ui-doc__section-title">2. React Checkbox Component</h2>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Label Wrap</h3>
            <Checkbox name="react-wrap" value="default">
            Default
            </Checkbox>

            <Checkbox name="react-wrap" value="checked" defaultChecked>
            Checked
            </Checkbox>

            <Checkbox name="react-wrap-disabled" value="disabled" disabled>
            Disabled
            </Checkbox>
            <Checkbox
            name="react-wrap-disabled-checked"
            value="checked-disabled"
            defaultChecked
            disabled
            >
            Checked Disabled
            </Checkbox>

            <Checkbox
            name="react-wrap-no-label"
            value="no-label"
            aria-label="라벨 없는 체크박스"
            />
        </div>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Detached Label</h3>
            <Checkbox
            id="react-checkbox-detached-default"
            structure="detached"
            name="react-detached"
            value="default"
            >
            Default
            </Checkbox>

            <Checkbox
            id="react-checkbox-detached-checked"
            structure="detached"
            name="react-detached"
            value="checked"
            defaultChecked
            >
            Checked
            </Checkbox>
            <Checkbox
            id="react-checkbox-detached-disabled"
            structure="detached"
            name="react-detached-disabled"
            value="disabled"
            disabled
            >
            Disabled
            </Checkbox>
            <Checkbox
            id="react-checkbox-detached-disabled-checked"
            structure="detached"
            name="react-detached-disabled-checked"
            value="checked-disabled"
            defaultChecked
            disabled
            >
            Checked Disabled
            </Checkbox>
            <Checkbox
            id="react-checkbox-detached-no-label"
            structure="detached"
            name="react-detached-no-label"
            value="no-label"
            aria-label="라벨 없는 체크박스"
            />
        </div>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Indeterminate (일부 선택, ref)</h3>
            <Checkbox ref={setIndeterminate} name="react-indeterminate" value="indeterminate">
            Indeterminate
            </Checkbox>
            <Checkbox ref={setIndeterminate} name="react-indeterminate-disabled" value="indeterminate-disabled" disabled>
            Indeterminate Disabled
            </Checkbox>
            <Checkbox ref={setIndeterminate} name="react-indeterminate-checked" value="indeterminate-checked" defaultChecked>
            Indeterminate + Checked
            </Checkbox>
        </div>
        </section>
        </main>
    );
}

export default CheckboxPage;