import './_foundation.scss';

type PrimitiveColor = {
    category: string;
    name: string;
    token: string;
    value: string;
};

const primitiveColors: PrimitiveColor[] = [
    // Base
    {
        category: 'Base',
        name: 'White',
        token: '$white',
        value: '#ffffff',
    },
    {
        category: 'Base',
        name: 'Black',
        token: '$black',
        value: '#000000',
    },

    // Gray
    {
        category: 'Gray',
        name: 'Gray 50',
        token: '$gray-50',
        value: '#f9fafb',
    },
    {
        category: 'Gray',
        name: 'Gray 100',
        token: '$gray-100',
        value: '#f3f4f6',
    },
    {
        category: 'Gray',
        name: 'Gray 200',
        token: '$gray-200',
        value: '#e5e7eb',
    },
    {
        category: 'Gray',
        name: 'Gray 300',
        token: '$gray-300',
        value: '#d1d5db',
    },
    {
        category: 'Gray',
        name: 'Gray 400',
        token: '$gray-400',
        value: '#9ca3af',
    },
    {
        category: 'Gray',
        name: 'Gray 500',
        token: '$gray-500',
        value: '#6b7280',
    },
    {
        category: 'Gray',
        name: 'Gray 600',
        token: '$gray-600',
        value: '#4b5563',
    },
    {
        category: 'Gray',
        name: 'Gray 700',
        token: '$gray-700',
        value: '#374151',
    },
    {
        category: 'Gray',
        name: 'Gray 800',
        token: '$gray-800',
        value: '#1f2937',
    },
    {
        category: 'Gray',
        name: 'Gray 900',
        token: '$gray-900',
        value: '#111827',
    },

    // Brand
    {
        category: 'Brand',
        name: 'Primary',
        token: '$primary',
        value: '#e6007e',
    },
    {
        category: 'Brand',
        name: 'Primary Pressed',
        token: '$primary-pressed',
        value: '#c9006f',
    },
    {
        category: 'Brand',
        name: 'Primary Disabled',
        token: '$primary-disabled',
        value: '#f2a3d0',
    },
    {
        category: 'Brand',
        name: 'Secondary',
        token: '$secondary',
        value: '#575b78',
    },
    {
        category: 'Brand',
        name: 'Secondary Pressed',
        token: '$secondary-pressed',
        value: '#474b66',
    },
    {
        category: 'Brand',
        name: 'Secondary Disabled',
        token: '$secondary-disabled',
        value: '#b8bbc8',
    },
    {
        category: 'Brand',
        name: 'Neutral',
        token: '$neutral',
        value: '#f5f5f5',
    },
    {
        category: 'Brand',
        name: 'Neutral Pressed',
        token: '$neutral-pressed',
        value: '#e5e5e5',
    },
    {
        category: 'Brand',
        name: 'Neutral Disabled',
        token: '$neutral-disabled',
        value: '#f7f7f7',
    },

    // Status
    {
        category: 'Status',
        name: 'Success',
        token: '$success',
        value: '#16a34a',
    },
    {
        category: 'Status',
        name: 'Warning',
        token: '$warning',
        value: '#f59e0b',
    },
    {
        category: 'Status',
        name: 'Error',
        token: '$error',
        value: '#dc2626',
    },
    {
        category: 'Status',
        name: 'Info',
        token: '$info',
        value: '#2563eb',
    },
];

const categories = [...new Set(primitiveColors.map((item) => item.category))];

export function PrimitivePreview() {
    return (
        <div className="sb-foundation">
            {categories.map((category) => (
                <section
                    key={category}
                    className="sb-foundation__section"
                >
                    <h2 className="sb-foundation__title">
                        {category}
                    </h2>

                    <div className="sb-foundation__grid">
                        {primitiveColors
                            .filter((item) => item.category === category)
                            .map((item) => (
                                <article
                                    key={item.token}
                                    className="sb-token-card"
                                >
                                    <div
                                        className="sb-token-card__preview"
                                        style={{
                                            backgroundColor: item.value,
                                        }}
                                    />

                                    <div className="sb-token-card__body">
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
                                </article>
                            ))}
                    </div>
                </section>
            ))}
        </div>
    );
}