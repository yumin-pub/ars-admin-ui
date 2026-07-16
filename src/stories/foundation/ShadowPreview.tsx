import './_foundation.scss';

type ShadowToken = {
    name: string;
    token: string;
    value: string;
    usage: string;
    className: string;
};

const shadowTokens: ShadowToken[] = [
    {
        name: 'None',
        token: '$shadow-none',
        value: 'none',
        usage: '그림자가 필요하지 않은 기본 상태에 사용한다.',
        className: 'sb-shadow-preview--none',
    },
    {
        name: 'Small',
        token: '$shadow-sm',
        value: '0 1px 2px rgba(0, 0, 0, 0.05)',
        usage: 'Input Focus, Button Hover 등 낮은 층위의 강조에 사용한다.',
        className: 'sb-shadow-preview--sm',
    },
    {
        name: 'Medium',
        token: '$shadow-md',
        value: '0 4px 8px rgba(0, 0, 0, 0.08)',
        usage: 'Dropdown, Select Option 등 떠 있는 요소에 사용한다.',
        className: 'sb-shadow-preview--md',
    },
    {
        name: 'Large',
        token: '$shadow-lg',
        value: '0 8px 16px rgba(0, 0, 0, 0.12)',
        usage: 'Modal, Drawer 등 높은 층위의 레이어에 사용한다.',
        className: 'sb-shadow-preview--lg',
    },
    {
        name: 'Extra Large',
        token: '$shadow-xl',
        value: '0 12px 24px rgba(0, 0, 0, 0.16)',
        usage: 'Toast, Floating Layer 등 가장 높은 강조에 사용한다.',
        className: 'sb-shadow-preview--xl',
    },
];

export function ShadowPreview() {
    return (
        <div className="sb-foundation">
            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">
                    Shadow Scale
                </h2>

                <div className="sb-shadow-grid">
                    {shadowTokens.map((item) => (
                        <article
                            key={item.token}
                            className="sb-shadow-item"
                        >
                            <div
                                className={`sb-shadow-item__preview ${item.className}`}
                            />

                            <div className="sb-shadow-item__body">
                                <strong className="sb-shadow-item__name">
                                    {item.name}
                                </strong>

                                <code className="sb-token-card__token">
                                    {item.token}
                                </code>

                                <span className="sb-token-card__value">
                                    {item.value}
                                </span>

                                <p className="sb-shadow-item__usage">
                                    {item.usage}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}