import { Button } from '../../components/Button';

const variants = ['solid', 'outline'] as const;
const colors = ['primary', 'secondary', 'neutral'] as const;
const sizes = ['lg', 'md'] as const;

function ButtonPage() {
    return (
        <main className="ui-doc">
        <h1 className="ui-doc__title">Button</h1>

        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">1. HTML Button Class</h2>

            {variants.map((variant) => (
            <div key={variant} className="ui-doc__group">
                <h3 className="ui-doc__group-title">{variant}</h3>

                {colors.map((color) => (
                <div key={color} className="ui-doc__row">
                    <strong className="ui-doc__label">{color}</strong>

                    {sizes.map((size) => (
                    <button
                        key={`${variant}-${color}-${size}`}
                        className={`ui-btn ui-btn--${variant} ui-btn--${color} ui-btn--${size}`}
                    >
                        {variant} {color} {size}
                    </button>
                    ))}

                    <button
                    className={`ui-btn ui-btn--${variant} ui-btn--${color} ui-btn--md is-selected`}
                    >
                    selected
                    </button>

                    <button
                    className={`ui-btn ui-btn--${variant} ui-btn--${color} ui-btn--md`}
                    disabled
                    >
                    disabled
                    </button>
                </div>
                ))}
            </div>
            ))}
        </section>

        <section className="ui-doc__section">
            <h2 className="ui-doc__section-title">2. React Button Component</h2>

            {variants.map((variant) => (
            <div key={variant} className="ui-doc__group">
                <h3 className="ui-doc__group-title">{variant}</h3>

                {colors.map((color) => (
                <div key={color} className="ui-doc__row">
                    <strong className="ui-doc__label">{color}</strong>

                    {sizes.map((size) => (
                    <Button
                        key={`${variant}-${color}-${size}`}
                        variant={variant}
                        color={color}
                        size={size}
                    >
                        {variant} {color} {size}
                    </Button>
                    ))}

                    <Button
                    variant={variant}
                    color={color}
                    size="md"
                    className="is-selected"
                    >
                    selected
                    </Button>

                    <Button variant={variant} color={color} size="md" disabled>
                    disabled
                    </Button>
                </div>
                ))}
            </div>
            ))}
        </section>
        </main>
    );
}

export default ButtonPage;