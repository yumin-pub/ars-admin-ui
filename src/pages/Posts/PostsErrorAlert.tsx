import { useEffect, useState } from 'react';

import type { PostsError } from './postsMutations';

/**
 * 같은 문구를 다시 읽히게 하려고 비워 두는 시간 (ms)
 * 한 프레임만 비우면 스크린리더가 바뀐 것으로 알아채지 못할 수 있어 조금 길게 둔다.
 */
const REANNOUNCE_DELAY_MS = 100;

export interface PostsErrorAlertProps {
    /**
     * 보여줄 오류. version이 바뀔 때마다 새 알림으로 다시 읽힌다.
     */
    error: PostsError | null;

    /**
     * 닫기 버튼
     */
    onClose: () => void;
}

/**
 * 추가·수정·삭제 실패 알림 (오류 전용 live 영역)
 * - role="alert" 영역은 항상 DOM에 두고 메시지만 바꾼다. (조건부로 마운트하면 놓치는 스크린리더가 있다)
 * - 새 오류가 오면 메시지를 잠깐 비웠다가 채운다. 같은 문구가 연달아 와도 내용이 바뀐 것으로 읽힌다.
 * - 닫기 버튼은 live 영역 밖에 두고, 오류가 있는 동안 계속 마운트한다.
 *   (알림과 함께 "닫기 버튼"까지 읽히지 않게, 새 오류가 와도 버튼에 있던 포커스를 잃지 않게)
 * - 자동으로 사라지지 않는다. 닫기 버튼으로만 지운다.
 *
 * 한계: 모달(aria-modal)이 열려 있는 동안 배경의 이 알림은 일부 스크린리더에서 읽히지 않을 수 있다.
 * (제출하면 모달이 바로 닫혀 보통은 해당하지 않지만, 이전 요청이 모달을 다시 연 뒤 늦게 실패하면 해당한다)
 */
function PostsErrorAlert({ error, onClose }: PostsErrorAlertProps) {
    // 화면에 채워도 되는 오류 version (새 오류가 오면 REANNOUNCE_DELAY_MS 뒤에 따라온다)
    const [readyVersion, setReadyVersion] = useState<number | null>(null);

    useEffect(() => {
        if (!error) return;

        const timer = window.setTimeout(() => setReadyVersion(error.version), REANNOUNCE_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [error]);

    const shown = error && error.version === readyVersion ? error : null;

    return (
        <div className={error ? 'ui-posts__alert is-visible' : 'ui-posts__alert'}>
            <div className="ui-posts__alert-live" role="alert">
                {shown && <p className="ui-posts__alert-message">{shown.message}</p>}
            </div>

            {error && (
                <button
                    type="button"
                    className="ui-posts__alert-close"
                    aria-label="오류 알림 닫기"
                    onClick={onClose}
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default PostsErrorAlert;
