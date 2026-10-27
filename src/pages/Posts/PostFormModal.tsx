import { useId, useRef, useState } from 'react';
import type { FocusEvent, FormEvent, KeyboardEvent } from 'react';

import type { PostInput, PostRow } from '../../api/posts';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

import {
    emptyPostFormValues,
    TAGS_MAX_COUNT,
    TAG_MAX_LENGTH,
    TITLE_MAX_LENGTH,
    TITLE_MIN_LENGTH,
    toPostFormValues,
    toPostInput,
    validatePostForm,
} from './postForm';
import type { PostFormValues } from './postForm';

export interface PostFormModalProps {
    /**
     * 'add': 빈 폼 / 'edit': row의 현재 값으로 채운다
     */
    mode: 'add' | 'edit';

    /**
     * 수정할 행 (화면에 보이는 값)
     */
    row?: PostRow;

    /**
     * 유효한 제출. 모달은 이 직후 바로 닫힌다. (낙관적 반영)
     * submittedAtMs: 제출 이벤트의 timeStamp (performance.now()와 같은 기준의 시각)
     * 부모가 "제출 직후 다시 열기 무시"를 판단할 때 쓴다. 부모가 시각을 직접 재지 않아도 된다.
     */
    onSubmit: (input: PostInput, submittedAtMs: number) => void;

    /**
     * 닫기 (취소·ESC·닫기 버튼·제출 후)
     */
    onClose: () => void;
}

type Touched = Record<keyof PostFormValues, boolean>;

/**
 * 게시글 추가·수정 모달
 * - 열 때마다 새로 마운트한다. (부모가 열린 동안만 그린다) 그래서 값·오류 상태가 남지 않는다.
 * - 오류는 입력칸을 벗어난 뒤(blur)나 제출할 때부터 보인다. 처음 열었을 때는 보이지 않는다.
 * - 제출 시 오류가 있으면 첫 번째 오류 입력칸으로 포커스를 옮긴다.
 * - 유효하면 한 번만 onSubmit을 부르고 바로 닫는다. 닫히는 사이 Enter·클릭이 더 와도 무시한다.
 * - 바깥(딤) 클릭으로는 닫지 않는다. (작성 중인 내용이 사라지지 않게) ESC로는 닫힌다.
 *   닫히면 Modal이 열기 전 포커스(추가 버튼 또는 그 행의 수정 버튼)로 돌려준다.
 */
function PostFormModal({ mode, row, onSubmit, onClose }: PostFormModalProps) {
    const baseId = useId();
    const formId = `${baseId}-form`;
    const titleId = `${baseId}-title`;
    const tagsId = `${baseId}-tags`;

    const [values, setValues] = useState<PostFormValues>(() =>
        row ? toPostFormValues(row) : emptyPostFormValues,
    );
    const [touched, setTouched] = useState<Touched>({ title: false, tagsText: false });
    const [submitted, setSubmitted] = useState(false);

    // 한 번 제출하면 다시 제출하지 않는다. (state는 다음 렌더까지 반영되지 않아 ref로 막는다)
    const submittedRef = useRef(false);
    const titleRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);

    const errors = validatePostForm(values);
    const visibleError = (field: keyof PostFormValues) =>
        touched[field] || submitted ? errors[field] : undefined;
    const titleError = visibleError('title');
    const tagsError = visibleError('tagsText');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submittedRef.current) return;

        setSubmitted(true);

        if (errors.title) {
            titleRef.current?.focus();
            return;
        }
        if (errors.tagsText) {
            tagsRef.current?.focus();
            return;
        }

        submittedRef.current = true;
        onSubmit(toPostInput(values), event.timeStamp);
        onClose();
    };

    /**
     * 제출로 이어지면 안 되는 Enter를 막는다.
     * - 한글 조합 중 Enter: 글자를 확정하는 키다.
     * - 반복 Enter(event.repeat): 열기 버튼에서 Enter를 길게 누르면 모달이 열린 뒤 반복 keydown이 입력칸으로 들어온다.
     *   그대로 두면 수정 모드는 열자마자 제출돼 닫히고, 추가 모드는 열자마자 "제목을 입력해 주세요"가 뜬다.
     * 정상적으로 한 번 누른 Enter(repeat: false)는 그대로 제출된다.
     */
    const preventUnintendedEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        if (event.nativeEvent.isComposing || event.repeat) event.preventDefault();
    };

    const initialValues = useRef(values);
    const change = (field: keyof PostFormValues) => (value: string) =>
        setValues((prev) => ({ ...prev, [field]: value }));

    /**
     * 입력칸을 벗어나면 "건드림"으로 보고 오류를 보이기 시작한다. 다음 경우만 건드림으로 본다.
     * - 값을 바꿨다. (어디로 벗어나든)
     * - 값은 그대로지만 폼 안의 다른 입력칸으로 옮겨 갔다. (Tab으로 지나간 경우)
     * 그 밖의 blur는 건드림이 아니다.
     * - 대화상자 빈 곳 클릭(포커스가 패널로 감), 취소·닫기 버튼으로 이동: 닫기 직전 오류가 깜박이지 않게
     * - 대화상자 밖으로 나감: 개발 모드 StrictMode에서 Modal effect가 두 번 돌며 포커스가 잠깐 바깥 버튼으로 갔다 오는 경우,
     *   창을 전환하는 경우
     */
    const touch = (field: keyof PostFormValues) => (event: FocusEvent<HTMLInputElement>) => {
        const isDirty = values[field] !== initialValues.current[field];
        const next = event.relatedTarget;
        const movesToOtherField = next instanceof HTMLInputElement && !!event.currentTarget.form?.contains(next);
        if (!isDirty && !movesToOtherField) return;

        setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    };

    const isAdd = mode === 'add';

    return (
        <Modal
            open
            title={isAdd ? '게시글 추가' : '게시글 수정'}
            onClose={onClose}
            closeOnDimmed={false}
            footer={(
                <>
                    <Button type="button" variant="outline" color="neutral" onClick={onClose}>
                        취소
                    </Button>
                    <Button type="submit" form={formId}>
                        {isAdd ? '추가' : '저장'}
                    </Button>
                </>
            )}
        >
            <form id={formId} className="ui-posts__form" noValidate onSubmit={handleSubmit}>
                <Input
                    ref={titleRef}
                    id={titleId}
                    label="제목"
                    type="text"
                    autoComplete="off"
                    aria-required="true"
                    value={values.title}
                    onChange={(event) => change('title')(event.target.value)}
                    onBlur={touch('title')}
                    onKeyDown={preventUnintendedEnter}
                    state={titleError ? 'error' : 'default'}
                    helperText={titleError ?? `${TITLE_MIN_LENGTH}~${TITLE_MAX_LENGTH}자로 입력합니다.`}
                    helperTextId={`${titleId}-message`}
                />

                <Input
                    ref={tagsRef}
                    id={tagsId}
                    label="태그"
                    type="text"
                    autoComplete="off"
                    placeholder="예: react, css"
                    value={values.tagsText}
                    onChange={(event) => change('tagsText')(event.target.value)}
                    onBlur={touch('tagsText')}
                    onKeyDown={preventUnintendedEnter}
                    state={tagsError ? 'error' : 'default'}
                    helperText={
                        tagsError
                        ?? `쉼표(,)로 구분해 ${TAGS_MAX_COUNT}개까지, 하나에 ${TAG_MAX_LENGTH}자 이하로 입력합니다.`
                    }
                    helperTextId={`${tagsId}-message`}
                />
            </form>
        </Modal>
    );
}

export default PostFormModal;
