/* ==========================
 * 게시글 추가·수정 폼 규칙 (순수 함수)
 * 모달(PostFormModal)은 화면만 맡고, 값 변환과 검증은 여기서 한다.
 * ========================== */

import type { PostInput, PostRow } from '../../api/posts';

export const TITLE_MIN_LENGTH = 2;
export const TITLE_MAX_LENGTH = 100;
export const TAGS_MAX_COUNT = 5;
export const TAG_MAX_LENGTH = 20;

/**
 * 폼 입력값 (입력칸 그대로의 문자열)
 */
export interface PostFormValues {
    title: string;

    /**
     * 쉼표로 구분한 태그 (예: "react, css")
     */
    tagsText: string;
}

export type PostFormErrors = Partial<Record<keyof PostFormValues, string>>;

export const emptyPostFormValues: PostFormValues = { title: '', tagsText: '' };

/**
 * 글자 수 (한글·이모지도 한 글자로 센다)
 */
function lengthOf(value: string) {
    return [...value].length;
}

/**
 * 쉼표로 구분한 태그 → 태그 목록
 * 앞뒤 공백 제거, 빈 항목 제거, 중복 제거(처음 나온 순서 유지)
 */
export function parseTags(tagsText: string): string[] {
    const tags = tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

    return [...new Set(tags)];
}

/**
 * 수정 모드의 처음 값
 */
export function toPostFormValues(row: Pick<PostRow, 'title' | 'tags'>): PostFormValues {
    return { title: row.title, tagsText: row.tags.join(', ') };
}

/**
 * 검증
 * - 제목: 필수(공백만 불가), 앞뒤 공백을 뺀 길이 2~100자
 * - 태그: 최대 5개, 각 20자 이하
 */
export function validatePostForm(values: PostFormValues): PostFormErrors {
    const errors: PostFormErrors = {};

    const title = values.title.trim();
    if (title === '') {
        errors.title = '제목을 입력해 주세요.';
    } else if (lengthOf(title) < TITLE_MIN_LENGTH || lengthOf(title) > TITLE_MAX_LENGTH) {
        errors.title = `제목은 ${TITLE_MIN_LENGTH}자 이상 ${TITLE_MAX_LENGTH}자 이하로 입력해 주세요. (지금 ${lengthOf(title)}자)`;
    }

    const tags = parseTags(values.tagsText);
    const longTag = tags.find((tag) => lengthOf(tag) > TAG_MAX_LENGTH);
    if (tags.length > TAGS_MAX_COUNT) {
        errors.tagsText = `태그는 ${TAGS_MAX_COUNT}개까지 입력할 수 있습니다. (지금 ${tags.length}개)`;
    } else if (longTag) {
        errors.tagsText = `태그는 하나에 ${TAG_MAX_LENGTH}자 이하로 입력해 주세요. ('${longTag}')`;
    }

    return errors;
}

/**
 * 오류가 없으면 서버에 보낼 값
 */
export function toPostInput(values: PostFormValues): PostInput {
    return { title: values.title.trim(), tags: parseTags(values.tagsText) };
}

/**
 * 수정 모드: 기준 값과 달라진 필드만 (없으면 빈 객체)
 * 기준 값도 폼과 같은 방식(앞뒤 공백 제거, 태그 정리)으로 다듬은 뒤 비교한다.
 * 서버 원본 태그에 중복이 있거나 제목에 앞뒤 공백이 있어도, 건드리지 않은 필드가 바뀐 것으로 잡히지 않게.
 */
export function changedFields(before: Pick<PostRow, 'title' | 'tags'>, after: PostInput): Partial<PostInput> {
    const base = toPostInput(toPostFormValues(before));
    const patch: Partial<PostInput> = {};
    if (after.title !== base.title) patch.title = after.title;
    if (after.tags.join('\u0000') !== base.tags.join('\u0000')) patch.tags = after.tags;

    return patch;
}
