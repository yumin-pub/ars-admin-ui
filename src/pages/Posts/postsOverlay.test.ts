import { describe, expect, it } from 'vitest';

import type { PostRow } from '../../api/posts';

import {
    addRow,
    confirmDelete,
    confirmEdit,
    discardDelete,
    discardEdit,
    editedPatch,
    editRow,
    initialPostsOverlay,
    mergePosts,
    pendingDeleteIds,
    removeRow,
    removeRows,
} from './postsOverlay';
import type { PostsOverlay } from './postsOverlay';

function row(id: number, title = `post ${id}`): PostRow {
    return { id, title, tags: ['tag'], likes: id, views: id * 10 };
}

/**
 * 객체·배열을 깊게 얼린다. 얼린 값을 바꾸려 하면 strict mode에서 오류가 난다.
 */
function deepFreeze<T>(value: T): T {
    if (value && typeof value === 'object') {
        Object.values(value).forEach(deepFreeze);
        Object.freeze(value);
    }

    return value;
}

const serverRows = [row(1, 'love story'), row(2, 'his mother'), row(3, 'lovely day')];

function merge(overlay: PostsOverlay, { q = '', page = 1, total = 30 } = {}) {
    return mergePosts({ rows: serverRows, total, overlay, q, page });
}

/**
 * 화면에 보일 1번 행의 제목
 */
function titleOf(overlay: PostsOverlay, id = 1) {
    return merge(overlay).rows.find((r) => r.id === id)?.title;
}

describe('mergePosts', () => {
    it('변경분이 없으면 서버 원본을 그대로 보여준다', () => {
        expect(merge(initialPostsOverlay)).toEqual({ rows: serverRows, total: 30 });
    });

    it('삭제한 행은 숨기고, 수정한 행은 덮어쓰고, 추가한 행은 맨 앞에 붙인다', () => {
        let overlay = addRow(initialPostsOverlay, row(-1, 'new'));
        overlay = editRow(overlay, serverRows[1], { title: 'edited' }, 1);
        overlay = removeRow(overlay, serverRows[2], 2);

        expect(merge(overlay).rows.map((r) => [r.id, r.title])).toEqual([
            [-1, 'new'],
            [1, 'love story'],
            [2, 'edited'],
        ]);
    });

    it('대기 중인 수정·삭제도 화면에 반영한다 (확정 전)', () => {
        let overlay = editRow(initialPostsOverlay, serverRows[0], { tags: ['x'] }, 1);
        overlay = removeRow(overlay, serverRows[1], 2);

        expect(merge(overlay).rows.map((r) => [r.id, r.tags])).toEqual([[1, ['x']], [3, ['tag']]]);
    });

    it('추가한 행은 1페이지에만 보인다', () => {
        const overlay = addRow(initialPostsOverlay, row(-1, 'new'));

        expect(merge(overlay, { page: 2 }).rows.map((r) => r.id)).toEqual([1, 2, 3]);
        // 총 건수에는 어느 페이지에서나 들어간다
        expect(merge(overlay, { page: 2 }).total).toBe(31);
    });

    it('수정한 뒤 삭제한 행은 숨겨지고 총 건수에서 한 번만 빠진다', () => {
        let overlay = editRow(initialPostsOverlay, serverRows[1], { title: 'edited' }, 1);
        overlay = removeRow(overlay, { id: 2, title: 'edited' }, 2);

        const merged = merge(overlay);
        expect(merged.rows.map((r) => r.id)).toEqual([1, 3]);
        expect(merged.total).toBe(29);
    });

    describe('검색어가 있을 때', () => {
        it('검색어에 맞는 추가 행은 보인다 (대소문자 무시)', () => {
            const overlay = addRow(initialPostsOverlay, row(-1, 'New LOVE letter'));
            const merged = merge(overlay, { q: 'love', total: 2 });

            expect(merged.rows[0].id).toBe(-1);
            expect(merged.total).toBe(3);
        });

        it('검색어에 맞지 않는 추가 행은 보이지 않고 총 건수에도 들어가지 않는다', () => {
            const overlay = addRow(initialPostsOverlay, row(-1, 'hello'));
            const merged = merge(overlay, { q: 'love', total: 2 });

            expect(merged.rows.map((r) => r.id)).not.toContain(-1);
            expect(merged.total).toBe(2);
        });

        it('수정으로 검색 조건을 벗어난 서버 행은 숨기고 이번 페이지 총 건수에서 뺀다', () => {
            const overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'hate story' }, 1);
            const merged = mergePosts({
                rows: [row(1, 'love story'), row(3, 'lovely day')],
                total: 2,
                overlay,
                q: 'love',
                page: 1,
            });

            expect(merged.rows.map((r) => r.id)).toEqual([3]);
            expect(merged.total).toBe(1);
        });

        it('검색어에 맞는 삭제 행만 총 건수에서 뺀다', () => {
            // 1(love story)과 2(his mother)를 삭제. 'love' 검색 결과에는 1만 들어 있었다.
            const overlay = removeRows(initialPostsOverlay, [serverRows[0], serverRows[1]], 1);
            const merged = mergePosts({
                rows: [row(3, 'lovely day')],
                total: 2,
                overlay,
                q: 'love',
                page: 1,
            });

            expect(merged.total).toBe(1);
        });

        it('수정한 행을 삭제한 뒤 원래 제목으로 검색하면 총 건수에서 빠진다', () => {
            // 'his mother'를 'love letter'로 고친 뒤 삭제 (화면에 보이는 제목을 넘긴다)
            let overlay = editRow(initialPostsOverlay, serverRows[1], { title: 'love letter' }, 1);
            overlay = confirmEdit(overlay, 2, 1);
            overlay = removeRow(overlay, { id: 2, title: 'love letter' }, 2);

            // 스냅샷은 서버 원본 제목이다
            expect(overlay.deleted[2].title).toBe('his mother');

            // 'mother' 검색: 서버 total(1)에 2번이 들어 있었으므로 빠져야 한다
            const byOriginal = mergePosts({ rows: [], total: 1, overlay, q: 'mother', page: 1 });
            expect(byOriginal.total).toBe(0);

            // 'love' 검색: 서버 total(2)에는 2번이 없었으므로 빼면 안 된다
            const byEdited = mergePosts({
                rows: [row(1, 'love story'), row(3, 'lovely day')],
                total: 2,
                overlay,
                q: 'love',
                page: 1,
            });
            expect(byEdited.total).toBe(2);
        });
    });

    describe('총 건수', () => {
        it('추가 + 삭제 + 수정이 섞인 경우', () => {
            let overlay = addRow(initialPostsOverlay, row(-1, 'a'));
            overlay = addRow(overlay, row(-2, 'b'));
            overlay = removeRow(overlay, serverRows[0], 1);
            overlay = editRow(overlay, serverRows[1], { title: 'edited' }, 2);
            // 추가한 행 하나를 지우면 추가 수에서만 빠지고 삭제 수에는 들어가지 않는다
            overlay = removeRow(overlay, row(-1), 3);

            // 30 + 1(추가) - 1(삭제), 수정은 건수에 영향 없음
            expect(merge(overlay).total).toBe(30);
            expect(merge(overlay).rows.map((r) => r.id)).toEqual([-2, 2, 3]);
        });

        it('삭제한 뒤 다른 페이지로 가도 총 건수가 같다', () => {
            const overlay = removeRow(initialPostsOverlay, serverRows[0], 1);
            const page1 = merge(overlay, { page: 1 });
            // 2페이지의 서버 행에는 삭제한 1번이 없다
            const page2 = mergePosts({
                rows: [row(11), row(12)],
                total: 30,
                overlay,
                q: '',
                page: 2,
            });

            expect(page1.total).toBe(29);
            expect(page2.total).toBe(29);
            expect(page2.rows.map((r) => r.id)).toEqual([11, 12]);
        });

        it('0보다 작아지지 않는다', () => {
            const overlay = removeRows(initialPostsOverlay, serverRows, 1);

            expect(merge(overlay, { total: 1 }).total).toBe(0);
        });
    });
});

describe('수정: 확정 값 + 대기 요청', () => {
    // 요청 A(1번): title a, 요청 B(2번): title b
    function sendAB() {
        let overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'a' }, 1);
        overlay = editRow(overlay, { id: 1, title: 'a' }, { title: 'b' }, 2);

        return overlay;
    }

    it('대기 중에는 나중 요청 값이 보인다', () => {
        expect(titleOf(sendAB())).toBe('b');
    });

    it.each([
        ['A 실패 → B 실패', ['discard', 1], ['discard', 2], 'love story'],
        ['B 실패 → A 실패', ['discard', 2], ['discard', 1], 'love story'],
        ['A 성공 → B 실패', ['confirm', 1], ['discard', 2], 'a'],
        ['A 실패 → B 성공', ['discard', 1], ['confirm', 2], 'b'],
        ['B 성공 → A 실패', ['confirm', 2], ['discard', 1], 'b'],
        ['B 성공 → A 성공 (응답이 거꾸로 와도 나중 요청이 남음)', ['confirm', 2], ['confirm', 1], 'b'],
        ['A 성공 → B 성공', ['confirm', 1], ['confirm', 2], 'b'],
        ['B 실패 → A 성공', ['discard', 2], ['confirm', 1], 'a'],
    ] as const)('%s', (_name, first, second, expected) => {
        const settle = (overlay: PostsOverlay, [result, requestId]: readonly ['confirm' | 'discard', number]) =>
            result === 'confirm' ? confirmEdit(overlay, 1, requestId) : discardEdit(overlay, 1, requestId);

        const overlay = settle(settle(sendAB(), first), second);

        expect(titleOf(overlay)).toBe(expected);
    });

    it('두 요청이 모두 실패하면 수정 기록이 남지 않는다', () => {
        const overlay = discardEdit(discardEdit(sendAB(), 1, 1), 1, 2);

        expect(overlay.edited).toEqual({});
    });

    it('같은 값으로 두 번 수정하고 첫 번째가 실패해도 두 번째 대기 요청은 남는다', () => {
        let overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'x' }, 1);
        overlay = editRow(overlay, { id: 1, title: 'x' }, { title: 'x' }, 2);
        overlay = discardEdit(overlay, 1, 1);

        expect(titleOf(overlay)).toBe('x');
        expect(overlay.edited[1].pending).toEqual([{ requestId: 2, patch: { title: 'x' } }]);

        // 두 번째가 성공하면 그대로, 실패하면 원래 값
        expect(titleOf(confirmEdit(overlay, 1, 2))).toBe('x');
        expect(titleOf(discardEdit(overlay, 1, 2))).toBe('love story');
    });

    it('필드별로 따로 계산한다 (A: title+tags 실패, B: title 대기)', () => {
        let overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'a', tags: ['a'] }, 1);
        overlay = editRow(overlay, { id: 1, title: 'a' }, { title: 'b' }, 2);
        overlay = discardEdit(overlay, 1, 1);

        expect(editedPatch(overlay.edited[1])).toEqual({ title: 'b' });
    });

    it('서버 원본 제목은 처음 수정할 때의 제목으로 남는다', () => {
        let overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'a' }, 1);
        overlay = editRow(overlay, { id: 1, title: 'a' }, { title: 'b' }, 2);

        expect(overlay.edited[1].serverTitle).toBe('love story');
    });

    it('없는 requestId를 확정·취소해도 그대로다', () => {
        const overlay = sendAB();

        expect(confirmEdit(overlay, 1, 99)).toBe(overlay);
        expect(discardEdit(overlay, 1, 99)).toBe(overlay);
        expect(confirmEdit(overlay, 999, 1)).toBe(overlay);
    });

    it('같은 requestId로 두 번 넣지 않는다', () => {
        const overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'a' }, 1);

        expect(editRow(overlay, serverRows[0], { title: 'z' }, 1)).toBe(overlay);
    });
});

describe('삭제: 요청 번호', () => {
    it('이미 삭제 중인 행은 다른 요청이 다시 맡지 않는다', () => {
        const once = removeRow(initialPostsOverlay, serverRows[0], 1);
        const twice = removeRow(once, serverRows[0], 2);

        expect(twice).toBe(once);
        expect(pendingDeleteIds(twice, 2)).toEqual([]);
        expect(pendingDeleteIds(twice, 1)).toEqual([1]);
    });

    it('맡은 요청만 확정·취소할 수 있다', () => {
        const overlay = removeRow(initialPostsOverlay, serverRows[0], 1);

        expect(confirmDelete(overlay, 1, 2)).toBe(overlay);
        expect(discardDelete(overlay, 1, 2)).toBe(overlay);
        expect(discardDelete(overlay, 1, 1).deleted).toEqual({});
        expect(confirmDelete(overlay, 1, 1).deleted[1].confirmed).toBe(true);
    });

    it('확정된 삭제는 취소되지 않는다', () => {
        const overlay = confirmDelete(removeRow(initialPostsOverlay, serverRows[0], 1), 1, 1);

        expect(discardDelete(overlay, 1, 1)).toBe(overlay);
        expect(pendingDeleteIds(overlay, 1)).toEqual([]);
    });

    it('수정한 뒤 삭제가 취소되면 수정한 값으로 다시 보인다', () => {
        let overlay = editRow(initialPostsOverlay, serverRows[1], { title: 'edited' }, 1);
        overlay = removeRow(overlay, { id: 2, title: 'edited' }, 2);
        overlay = discardDelete(overlay, 2, 2);

        expect(titleOf(overlay, 2)).toBe('edited');
    });
});

describe('변경분 함수', () => {
    it('추가한 행을 수정하면 추가 목록의 행이 바뀐다', () => {
        let overlay = addRow(initialPostsOverlay, row(-1, 'new'));
        overlay = editRow(overlay, row(-1), { title: 'renamed', tags: ['x'] }, 1);

        expect(overlay.added[0]).toMatchObject({ id: -1, title: 'renamed', tags: ['x'] });
        expect(overlay.edited).toEqual({});
    });

    it('추가한 행을 삭제하면 추가 목록에서 빠지고 삭제 기록은 남지 않는다', () => {
        let overlay = addRow(initialPostsOverlay, row(-1, 'new'));
        overlay = removeRow(overlay, row(-1), 1);

        expect(overlay.added).toEqual([]);
        expect(overlay.deleted).toEqual({});
    });

    it('같은 id를 한 요청에서 두 번 삭제해도 한 번만 기록된다', () => {
        expect(removeRows(initialPostsOverlay, [row(1), row(1)], 1).deleted).toEqual({
            1: { id: 1, title: 'post 1', requestId: 1, confirmed: false },
        });
    });

    it('없는 id를 수정·삭제해도 오류 없이 처리된다', () => {
        // 없는 임시 id: 아무것도 바뀌지 않는다
        expect(editRow(initialPostsOverlay, row(-99), { title: 'x' }, 1)).toBe(initialPostsOverlay);
        expect(removeRow(initialPostsOverlay, row(-99), 1)).toBe(initialPostsOverlay);

        // 목록에 없는 서버 id: 기록만 하고, 합칠 때는 영향이 없다
        const overlay = editRow(initialPostsOverlay, row(999), { title: 'x' }, 1);
        expect(merge(overlay)).toEqual({ rows: serverRows, total: 30 });
    });

    it('patch에는 title, tags만 들어간다', () => {
        const patch = { title: 'x', likes: 999 } as unknown as { title: string };
        const overlay = editRow(initialPostsOverlay, serverRows[0], patch, 1);

        expect(overlay.edited[1].pending[0].patch).toEqual({ title: 'x' });
        expect(merge(overlay).rows[0].likes).toBe(1);
    });

    it('빈 patch는 아무것도 바꾸지 않는다', () => {
        expect(editRow(initialPostsOverlay, serverRows[0], {}, 1)).toBe(initialPostsOverlay);
    });
});

describe('불변성', () => {
    it('모든 함수가 입력을 바꾸지 않는다', () => {
        const rows = deepFreeze(serverRows.map((r) => ({ ...r, tags: [...r.tags] })));
        const snapshot = structuredClone(rows);

        const original: PostsOverlay = deepFreeze(addRow(initialPostsOverlay, row(-1, 'new')));
        const originalSnapshot = structuredClone(original);

        // 얼린 값을 바꾸려 하면 TypeError가 난다 (모듈 코드는 strict mode)
        addRow(original, row(-2));
        editRow(original, row(-1), { title: 'x' }, 1);
        removeRow(original, row(-1), 1);

        const edited = deepFreeze(editRow(original, rows[0], { title: 'x' }, 1));
        editRow(edited, rows[0], { tags: ['y'] }, 2);
        confirmEdit(edited, 1, 1);
        discardEdit(edited, 1, 1);
        editedPatch(edited.edited[1]);

        const removed = deepFreeze(removeRows(edited, [rows[0], rows[1]], 3));
        confirmDelete(removed, 1, 3);
        discardDelete(removed, 1, 3);
        pendingDeleteIds(removed, 3);

        mergePosts({ rows, total: 30, overlay: removed, q: 'x', page: 1 });
        mergePosts({ rows, total: 30, overlay: edited, q: '', page: 1 });

        expect(rows).toEqual(snapshot);
        expect(original).toEqual(originalSnapshot);
        expect(initialPostsOverlay).toEqual({ added: [], edited: {}, deleted: {} });
    });

    it('합친 행은 서버 행과 다른 객체다 (수정한 행)', () => {
        const overlay = editRow(initialPostsOverlay, serverRows[0], { title: 'x' }, 1);
        const merged = merge(overlay);

        expect(merged.rows[0]).not.toBe(serverRows[0]);
        expect(serverRows[0].title).toBe('love story');
    });
});
