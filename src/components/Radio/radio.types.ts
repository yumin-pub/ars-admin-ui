import type {
    InputHTMLAttributes,
    ReactNode,
} from 'react';

export interface RadioProps
    extends InputHTMLAttributes<HTMLInputElement> { 

    /**
     * 라벨 텍스트
     */
    label?: ReactNode;

    /**
     * Label Wrap / Detached Label
     *
     * Union Type = 둘 중 하나만 가능
     *
     * structure는 선택값(Optional)
     *
     * 안 쓰면 Radio.tsx에서 기본값 'wrap' 사용
     *
     * 사용하면 'wrap' | 'detached' 둘 중 하나만 가능
     */
    structure?: 'wrap' | 'detached';

    /**
     * ui-radio 추가 클래스
     */
    className?: string;
    }