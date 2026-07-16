import './_foundation.scss';

type RadiusToken = {
    name: string;
    token: string;
    value: string;
};

const radiusTokens: RadiusToken[] = [
    {
        name: 'None',
        token: '$radius-none',
        value: '0',
    },
    {
        name: 'Small',
        token: '$radius-sm',
        value: '4px',
    },
    {
        name: 'Medium',
        token: '$radius-md',
        value: '6px',
    },
    {
        name: 'Large',
        token: '$radius-lg',
        value: '8px',
    },
    {
        name: 'Extra Large',
        token: '$radius-xl',
        value: '12px',
    },
    {
        name: '2XL',
        token: '$radius-2xl',
        value: '16px',
    },
    {
        name: 'Full',
        token: '$radius-full',
        value: '9999px',
    },
];

export function RadiusPreview() {
    return (
        <div className="sb-foundation">
            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">
                    Radius Scale
                </h2>

                <div className="sb-radius-list">
                    {radiusTokens.map((item) => (
                        <article
                            key={item.token}
                            className="sb-radius-item"
                        >
                            <div className="sb-radius-item__meta">
                                <strong className="sb-token-card__name">
                                    {item.name}
                                </strong>

                                <code className="sb-token-card__token">
                                    {item.token}
                                </code>

                                <span className="sb-token-card__value">
                                    {item.value}
                                </span>
                            </div>

                            <div className="sb-radius-item__preview">
                                <div
                                    className="sb-radius-item__box"
                                    style={{
                                        borderRadius: item.value,
                                    }}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}