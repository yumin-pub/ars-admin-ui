import { describe, expect, it } from 'vitest';

import {
    changedFields,
    parseTags,
    toPostFormValues,
    toPostInput,
    validatePostForm,
} from './postForm';

describe('parseTags', () => {
    it('쉼표로 나누고 앞뒤 공백·빈 항목·중복을 지운다', () => {
        expect(parseTags(' react ,css,, react , ,ui ')).toEqual(['react', 'css', 'ui']);
    });

    it('빈 문자열이면 빈 목록', () => {
        expect(parseTags('')).toEqual([]);
        expect(parseTags(' , , ')).toEqual([]);
    });
});

describe('validatePostForm', () => {
    it('제목이 비었거나 공백만 있으면 오류', () => {
        expect(validatePostForm({ title: '', tagsText: '' }).title).toBe('제목을 입력해 주세요.');
        expect(validatePostForm({ title: '   ', tagsText: '' }).title).toBe('제목을 입력해 주세요.');
    });

    it('제목은 앞뒤 공백을 뺀 길이가 2~100자', () => {
        expect(validatePostForm({ title: ' a ', tagsText: '' }).title).toContain('2자 이상 100자 이하');
        expect(validatePostForm({ title: 'ab', tagsText: '' })).toEqual({});
        expect(validatePostForm({ title: 'a'.repeat(100), tagsText: '' })).toEqual({});
        expect(validatePostForm({ title: 'a'.repeat(101), tagsText: '' }).title).toContain('지금 101자');
    });

    it('한글도 한 글자씩 센다', () => {
        expect(validatePostForm({ title: '가', tagsText: '' }).title).toBeDefined();
        expect(validatePostForm({ title: '공지', tagsText: '' })).toEqual({});
    });

    it('태그는 최대 5개 (중복은 하나로 센다)', () => {
        expect(validatePostForm({ title: 'ok', tagsText: 'a,b,c,d,e' })).toEqual({});
        expect(validatePostForm({ title: 'ok', tagsText: 'a,b,c,d,e,a' })).toEqual({});
        expect(validatePostForm({ title: 'ok', tagsText: 'a,b,c,d,e,f' }).tagsText).toContain('5개까지');
    });

    it('태그는 하나에 20자 이하', () => {
        expect(validatePostForm({ title: 'ok', tagsText: 'a'.repeat(20) })).toEqual({});
        expect(validatePostForm({ title: 'ok', tagsText: `x, ${'b'.repeat(21)}` }).tagsText).toContain(`'${'b'.repeat(21)}'`);
    });
});

describe('값 변환', () => {
    it('toPostInput은 제목을 다듬고 태그를 목록으로 바꾼다', () => {
        expect(toPostInput({ title: '  공지  ', tagsText: 'a, b, a' })).toEqual({ title: '공지', tags: ['a', 'b'] });
    });

    it('toPostFormValues는 태그를 쉼표로 잇는다', () => {
        expect(toPostFormValues({ title: 't', tags: ['a', 'b'] })).toEqual({ title: 't', tagsText: 'a, b' });
    });

    it('changedFields는 바뀐 필드만 돌려준다', () => {
        const before = { title: 't', tags: ['a', 'b'] };

        expect(changedFields(before, { title: 't', tags: ['a', 'b'] })).toEqual({});
        expect(changedFields(before, { title: 'u', tags: ['a', 'b'] })).toEqual({ title: 'u' });
        expect(changedFields(before, { title: 't', tags: ['b', 'a'] })).toEqual({ tags: ['b', 'a'] });
    });

    it('changedFields는 정리되지 않은 원본과도 폼 기준으로 비교한다 (건드리지 않은 필드는 넣지 않음)', () => {
        const before = { title: '  t  ', tags: ['a', 'a', ' b '] };
        // 폼에 그대로 열었다가 제목만 바꾼 경우
        const untouched = toPostInput(toPostFormValues(before));

        expect(changedFields(before, untouched)).toEqual({});
        expect(changedFields(before, { ...untouched, title: 'u' })).toEqual({ title: 'u' });
    });
});
