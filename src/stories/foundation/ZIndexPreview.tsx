import './_foundation.scss';
import { TokenMeta } from './TokenMeta';

type ZIndexToken = {
    name: string;
    token: string;
    value: number;
    usage: string;
};

const zIndexTokens: ZIndexToken[] = [
    {
        name: 'Hide',
        token: '$z-hide',
        value: -1,
        usage: '화면 뒤로 숨겨야 하는 요소에 사용한다.',
    },
    {
        name: 'Base',
        token: '$z-base',
        value: 1,
        usage: '기본 콘텐츠 레이어에 사용한다.',
    },
    {
        name: 'Sticky',
        token: '$z-sticky',
        value: 100,
        usage: 'Sticky UI 요소에 사용한다.',
    },
    {
        name: 'Header',
        token: '$z-header',
        value: 200,
        usage: '고정 Header에 사용한다.',
    },
    {
        name: 'Dropdown',
        token: '$z-dropdown',
        value: 300,
        usage: 'Dropdown과 Select Option에 사용한다.',
    },
    {
        name: 'Tooltip',
        token: '$z-tooltip',
        value: 400,
        usage: 'Tooltip에 사용한다.',
    },
    {
        name: 'Overlay',
        token: '$z-overlay',
        value: 900,
        usage: 'Dimmed와 Overlay 레이어에 사용한다.',
    },
    {
        name: 'Modal',
        token: '$z-modal',
        value: 1000,
        usage: 'Modal과 Dialog에 사용한다.',
    },
    {
        name: 'Toast',
        token: '$z-toast',
        value: 1100,
        usage: 'Toast와 Floating Notification에 사용한다.',
    },
    {
        name: 'Loading',
        token: '$z-loading',
        value: 1200,
        usage: '전역 Loading Layer에 사용한다.',
    },
];

export function ZIndexPreview() {
    return (
        <div className="sb-foundation">
            <section className="sb-foundation__section">
                <h2 className="sb-foundation__title">Z-index Scale</h2>

                <div className="sb-z-index-list">
                    {zIndexTokens.map((item, index) => (
                        <article
                            key={item.token}
                            className="sb-z-index-item"
                        >
                            <TokenMeta
                                name={item.name}
                                token={item.token}
                                value={item.value}
                                description={item.usage}
                            />

                            <div className="sb-z-index-item__preview">
                                <span
                                    className="sb-z-index-item__layer"
                                    style={{
                                        transform: `translate(${index * 4}px, ${index * -4}px)`,
                                    }}
                                >
                                    {item.value}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}