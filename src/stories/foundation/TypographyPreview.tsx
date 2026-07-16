import './_foundation.scss';

type FontSizeToken = {
    name: string;
    token: string;
    value: string;
    className: string;
};

type FontWeightToken = {
    name: string;
    token: string;
    value: number;
};

type LineHeightToken = {
    name: string;
    token: string;
    value: number;
};

const fontSizes: FontSizeToken[] = [
    {
        name: 'Extra Small',
        token: '$fs-xs',
        value: '12px',
        className: 'sb-typography-preview--fs-xs',
    },
    {
        name: 'Small',
        token: '$fs-sm',
        value: '13px',
        className: 'sb-typography-preview--fs-sm',
    },
    {
        name: 'Medium',
        token: '$fs-md',
        value: '14px',
        className: 'sb-typography-preview--fs-md',
    },
    {
        name: 'Large',
        token: '$fs-lg',
        value: '16px',
        className: 'sb-typography-preview--fs-lg',
    },
    {
        name: 'Extra Large',
        token: '$fs-xl',
        value: '18px',
        className: 'sb-typography-preview--fs-xl',
    },
    {
        name: '2XL',
        token: '$fs-2xl',
        value: '20px',
        className: 'sb-typography-preview--fs-2xl',
    },
    {
        name: '3XL',
        token: '$fs-3xl',
        value: '24px',
        className: 'sb-typography-preview--fs-3xl',
    },
];

const fontWeights: FontWeightToken[] = [
    {
        name: 'Regular',
        token: '$fw-regular',
        value: 400,
    },
    {
        name: 'Medium',
        token: '$fw-medium',
        value: 500,
    },
    {
        name: 'Semibold',
        token: '$fw-semibold',
        value: 600,
    },
    {
        name: 'Bold',
        token: '$fw-bold',
        value: 700,
    },
];

const lineHeights: LineHeightToken[] = [
    {
        name: 'Tight',
        token: '$lh-tight',
        value: 1.2,
    },
    {
        name: 'Base',
        token: '$lh-base',
        value: 1.5,
    },
    {
        name: 'Relaxed',
        token: '$lh-relaxed',
        value: 1.7,
    },
];

export function TypographyPreview() {
    return (
        <div className="sb-foundation">
            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">Font Size</h2>

                <div className="sb-typography-list">
                    {fontSizes.map((item) => (
                        <article
                            key={item.token}
                            className="sb-typography-item"
                        >
                            <div className="sb-typography-item__meta">
                                <strong className="sb-typography-item__name">
                                    {item.name}
                                </strong>

                                <code className="sb-token-card__token">
                                    {item.token}
                                </code>

                                <span className="sb-token-card__value">
                                    {item.value}
                                </span>
                            </div>

                            <p
                                className={`sb-typography-item__preview ${item.className}`}
                            >
                                UI System Typography
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">Font Weight</h2>

                <div className="sb-typography-list">
                    {fontWeights.map((item) => (
                        <article
                            key={item.token}
                            className="sb-typography-item"
                        >
                            <div className="sb-typography-item__meta">
                                <strong className="sb-typography-item__name">
                                    {item.name}
                                </strong>

                                <code className="sb-token-card__token">
                                    {item.token}
                                </code>

                                <span className="sb-token-card__value">
                                    {item.value}
                                </span>
                            </div>

                            <p
                                className="sb-typography-item__preview sb-typography-preview--fs-xl"
                                style={{ fontWeight: item.value }}
                            >
                                UI System Typography
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">Line Height</h2>

                <div className="sb-typography-list">
                    {lineHeights.map((item) => (
                        <article
                            key={item.token}
                            className="sb-typography-item"
                        >
                            <div className="sb-typography-item__meta">
                                <strong className="sb-typography-item__name">
                                    {item.name}
                                </strong>

                                <code className="sb-token-card__token">
                                    {item.token}
                                </code>

                                <span className="sb-token-card__value">
                                    {item.value}
                                </span>
                            </div>

                            <p
                                className="sb-typography-item__preview sb-typography-preview--fs-lg"
                                style={{ lineHeight: item.value }}
                            >
                                일관된 타이포그래피 기준은 정보의 위계와 가독성을 유지한다.
                                <br />
                                동일한 토큰을 사용하여 여러 프로젝트에서도 같은 기준을 재사용한다.
                            </p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}