import { Checkbox } from '../../components/Checkbox';

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
                <input type="checkbox" className="ui-checkbox__input" />
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
                />

                <label className="ui-checkbox__wrapper" htmlFor="checkbox-no-label">
                <span className="ui-checkbox__control"></span>
                </label>
            </span>
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

            <Checkbox name="react-wrap-no-label" value="no-label" />
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
            />
        </div>
        </section>        
        </main>
    );
}

export default CheckboxPage;