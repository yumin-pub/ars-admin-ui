import type {
    Meta,
    StoryObj,
} from '@storybook/react-vite';

import { Badge } from '../../../components/Badge';
import BadgePage from '../../../pages/UISystem/BadgePage';

const meta = {
    title: 'Components/Badge',
    component: Badge,
    parameters: {
        layout: 'padded',
    },
    args: {
        children: '노출중',
        variant: 'success',
        className: '',
    },
    argTypes: {
        children: {
            control: 'text',
            description: '표시할 상태 텍스트',
        },
        variant: {
            control: 'select',
            options: [
                'success',
                'warning',
                'neutral',
            ],
            description: '상태 색상',
        },
        className: {
            control: 'text',
            description: '추가 클래스',
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
    render: () => <BadgePage />,
};
