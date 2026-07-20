import './_foundation.scss';
import { TokenMeta } from './TokenMeta';

type SpacingToken = {
    token: string;
    value: string;
};

const spacingTokens: SpacingToken[] = [
    { token: '$space-0', value: '0' },
    { token: '$space-1', value: '4px' },
    { token: '$space-2', value: '8px' },
    { token: '$space-3', value: '12px' },
    { token: '$space-4', value: '16px' },
    { token: '$space-5', value: '20px' },
    { token: '$space-6', value: '24px' },
    { token: '$space-7', value: '28px' },
    { token: '$space-8', value: '32px' },
    { token: '$space-10', value: '40px' },
    { token: '$space-11', value: '44px' },
    { token: '$space-12', value: '48px' },
    { token: '$space-16', value: '64px' },
    { token: '$space-20', value: '80px' },
    { token: '$space-24', value: '96px' },
];

export function SpacingPreview() {
    return (
        <div className="sb-foundation">
            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">
                    Spacing Scale
                </h2>

                <div className="sb-spacing-list">
                    {spacingTokens.map((item) => (
                        <article
                            key={item.token}
                            className="sb-spacing-item"
                        >
                            <TokenMeta
                                name={item.token.replace('$', '')}
                                token={item.token}
                                value={item.value}
                            />

                            <div className="sb-spacing-item__preview">
                                <div
                                    className="sb-spacing-item__bar"
                                    style={{
                                        width:
                                            item.value === '0'
                                                ? '1px'
                                                : item.value,
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