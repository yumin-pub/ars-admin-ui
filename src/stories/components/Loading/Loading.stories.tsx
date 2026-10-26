import type {
    Meta,
    StoryObj,
} from '@storybook/react-vite';

import { Loading } from '../../../components/Loading';
import LoadingPage from '../../../pages/UISystem/LoadingPage';

const meta = {
    title: 'Components/Loading',
    component: Loading,
    parameters: {
        layout: 'padded',
    },
    args: {
        overlay: false,
        size: 'md',
        message: '데이터를 불러오는 중입니다.',
        description: '잠시만 기다려 주세요.',
        className: '',
    },
    argTypes: {
        overlay: {
            control: 'boolean',
            description: '가장 가까운 position 기준 영역 전체를 dimmed overlay로 덮음',
        },
        size: {
            control: 'select',
            options: [
                'sm',
                'md',
                'lg',
            ],
            description: 'Spinner·패널 크기',
        },
        message: {
            control: 'text',
            description: '기본 안내 문구',
        },
        description: {
            control: 'text',
            description: '보조 안내 문구 (null이면 표시하지 않음)',
        },
        className: {
            control: 'text',
            description: '추가 클래스',
        },
    },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoDescription: Story = {
    args: {
        size: 'sm',
        message: '다음 페이지를 불러오는 중입니다.',
        description: null,
    },
};

export const Examples: Story = {
    render: () => <LoadingPage />,
};
