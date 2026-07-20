interface TokenMetaProps {
    name: string;
    token: string;
    value: string | number;
    description?: string;
}

export function TokenMeta({
    name,
    token,
    value,
    description,
}: TokenMetaProps) {
    return (
        <div className="sb-token-meta">
            <strong className="sb-token-meta__name">
                {name}
            </strong>

            <code className="sb-token-meta__token">
                {token}
            </code>

            <span className="sb-token-meta__value">
                {value}
            </span>

            {description && (
                <p className="sb-token-meta__description">
                    {description}
                </p>
            )}
        </div>
    );
}