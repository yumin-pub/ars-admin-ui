import './_foundation.scss';
import { TokenMeta } from './TokenMeta';

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
                            <TokenMeta
                                name={item.name}
                                token={item.token}
                                value={item.value}
                            />

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