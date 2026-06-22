import { Select } from '../../components/Select';

function SelectPage() {
    return (
        <main className="ui-doc">
        <h1 className="ui-doc__title">Select</h1>

        <section className="ui-doc__section">
        <h2 className="ui-doc__section-title">2. React Select Component</h2>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Default</h3>

            <Select
            id="react-select-default"
            label="상태"
            helperText="상태를 선택해주세요."
            defaultValue=""
            options={[
                { label: '선택하세요', value: '' },
                { label: '사용', value: 'active' },
                { label: '미사용', value: 'inactive' },
            ]}
            />
        </div>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Error</h3>

            <Select
            id="react-select-error"
            label="구분"
            state="error"
            helperText="필수 선택 항목입니다."
            defaultValue=""
            options={[
                { label: '선택하세요', value: '' },
                { label: '공지', value: 'notice' },
                { label: '이벤트', value: 'event' },
            ]}
            />
        </div>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Disabled</h3>

            <Select
            id="react-select-disabled"
            label="권한"
            disabled
            defaultValue=""
            options={[
                { label: '선택 불가', value: '' },
                { label: '관리자', value: 'admin' },
                { label: '사용자', value: 'user' },
            ]}
            />
        </div>

        <div className="ui-doc__group">
            <h3 className="ui-doc__group-title">Variant</h3>

            <Select
            id="react-select-outline"
            label="Outline"
            variant="outline"
            options={[
                { label: '선택하세요', value: '' },
                { label: '옵션 1', value: 'one' },
                { label: '옵션 2', value: 'two' },
            ]}
            />

            <Select
            id="react-select-underline"
            label="Underline"
            variant="underline"
            options={[
                { label: '선택하세요', value: '' },
                { label: '옵션 1', value: 'one' },
                { label: '옵션 2', value: 'two' },
            ]}
            />

            <Select
            id="react-select-ghost"
            label="Ghost"
            variant="ghost"
            options={[
                { label: '선택하세요', value: '' },
                { label: '옵션 1', value: 'one' },
                { label: '옵션 2', value: 'two' },
            ]}
            />
        </div>
        </section>
        </main>
    );
}

export default SelectPage;