import { Radio } from '../../components/Radio';
function RadioPage() {
    return (
        <main className="ui-doc">
            <h1 className="ui-doc__title">Radio</h1>

            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">1. HTML Radio Class</h2>

                <div className="ui-doc__group">
                <h3 className="ui-doc__group-title">Label Wrap</h3>

                <label className="ui-radio ui-radio--wrap">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="wrap-radio"
                    />
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Default</span>
                </label>

                <label className="ui-radio ui-radio--wrap">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="wrap-radio"
                    defaultChecked
                    />
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Checked</span>
                </label>

                <label className="ui-radio ui-radio--wrap">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="wrap-disabled"
                    disabled
                    />
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Disabled</span>
                </label>

                <label className="ui-radio ui-radio--wrap">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="wrap-disabled-checked"
                    defaultChecked
                    disabled
                    />
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Checked Disabled</span>
                </label>

                <label className="ui-radio ui-radio--wrap">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="wrap-no-label"
                    />
                    <span className="ui-radio__control"></span>
                </label>
                </div>

                <div className="ui-doc__group">
                <h3 className="ui-doc__group-title">Detached Label</h3>

                <span className="ui-radio ui-radio--detached">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="detached-radio"
                    id="detached-radio-default"
                    />
                    <label
                    className="ui-radio__wrapper"
                    htmlFor="detached-radio-default"
                    >
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Default</span>
                    </label>
                </span>

                <span className="ui-radio ui-radio--detached">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="detached-radio"
                    id="detached-radio-checked"
                    defaultChecked
                    />
                    <label
                    className="ui-radio__wrapper"
                    htmlFor="detached-radio-checked"
                    >
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Checked</span>
                    </label>
                </span>

                <span className="ui-radio ui-radio--detached">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="detached-disabled"
                    id="detached-radio-disabled"
                    disabled
                    />
                    <label
                    className="ui-radio__wrapper"
                    htmlFor="detached-radio-disabled"
                    >
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Disabled</span>
                    </label>
                </span>

                <span className="ui-radio ui-radio--detached">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="detached-disabled-checked"
                    id="detached-radio-disabled-checked"
                    defaultChecked
                    disabled
                    />
                    <label
                    className="ui-radio__wrapper"
                    htmlFor="detached-radio-disabled-checked"
                    >
                    <span className="ui-radio__control"></span>
                    <span className="ui-radio__label">Checked Disabled</span>
                    </label>
                </span>

                <span className="ui-radio ui-radio--detached">
                    <input
                    type="radio"
                    className="ui-radio__input"
                    name="detached-no-label"
                    id="detached-radio-no-label"
                    />
                    <label
                    className="ui-radio__wrapper"
                    htmlFor="detached-radio-no-label"
                    >
                    <span className="ui-radio__control"></span>
                    </label>
                </span>
                </div>
            </section>
            <section className="ui-doc__section">
                <h2 className="ui-doc__section-title">2. React Radio Component</h2>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Label Wrap</h3>

                    <Radio name="react-wrap" value="default">
                    Default
                    </Radio>

                    <Radio name="react-wrap" value="checked" defaultChecked>
                    Checked
                    </Radio>

                    <Radio name="react-wrap-disabled" value="disabled" disabled>
                    Disabled
                    </Radio>

                    <Radio
                    name="react-wrap-disabled-checked"
                    value="checked-disabled"
                    defaultChecked
                    disabled
                    >
                    Checked Disabled
                    </Radio>

                    <Radio name="react-wrap-no-label" value="no-label" />
                </div>

                <div className="ui-doc__group">
                    <h3 className="ui-doc__group-title">Detached Label</h3>

                    <Radio
                    id="react-detached-default"
                    structure="detached"
                    name="react-detached"
                    value="default"
                    >
                    Default
                    </Radio>

                    <Radio
                    id="react-detached-checked"
                    structure="detached"
                    name="react-detached"
                    value="checked"
                    defaultChecked
                    >
                    Checked
                    </Radio>

                    <Radio
                    id="react-detached-disabled"
                    structure="detached"
                    name="react-detached-disabled"
                    value="disabled"
                    disabled
                    >
                    Disabled
                    </Radio>

                    <Radio
                    id="react-detached-disabled-checked"
                    structure="detached"
                    name="react-detached-disabled-checked"
                    value="checked-disabled"
                    defaultChecked
                    disabled
                    >
                    <span>Checked Disabled</span>
                    </Radio>

                    <Radio
                    id="react-detached-no-label"
                    structure="detached"
                    name="react-detached-no-label"
                    value="no-label"
                    />
                </div>
            </section>
        </main>
    );
}

export default RadioPage;