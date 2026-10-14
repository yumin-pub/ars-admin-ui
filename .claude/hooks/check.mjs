// Claude Code PostToolUse hook
// Edit / Write 로 파일이 바뀐 직후, 그 파일 종류에 맞는 검사를 자동으로 돌린다.
//
//   .ts / .tsx  → 타입체크(tsc -b) + 린트(eslint, 바뀐 파일만)
//   .scss       → Sass 컴파일 검사 (결과 파일은 만들지 않는다)
//   그 외       → 아무것도 하지 않는다
//
// 실패하면 오류 내용을 stderr 로 내보내고 exit 2 로 끝낸다.
// → Claude Code 가 그 내용을 Claude 에게 그대로 전달해서 스스로 고치게 한다.
// 통과하면 아무 출력 없이 exit 0.

import { spawnSync } from 'node:child_process';
import path from 'node:path';

const MAX_LINES = 40;

function readStdin() {
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => (data += chunk));
        process.stdin.on('end', () => resolve(data));
        // stdin 이 없는 환경(직접 실행)에서 멈추지 않도록
        if (process.stdin.isTTY) resolve('');
    });
}

// Windows 의 npx.cmd 도 실행되도록 shell 을 켠다.
function run(command, args, cwd) {
    return spawnSync(command, args, {
        cwd,
        shell: true,
        encoding: 'utf8',
        timeout: 110_000,
    });
}

function tail(text) {
    const lines = text.trim().split('\n');
    return lines.length > MAX_LINES
        ? ['...(앞부분 생략)', ...lines.slice(-MAX_LINES)].join('\n')
        : lines.join('\n');
}

function fail(title, result) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    console.error(`[자동 검사 실패] ${title}\n${tail(output)}`);
    process.exit(2);
}

const raw = await readStdin();
let input = {};
try {
    input = raw ? JSON.parse(raw) : {};
} catch {
    process.exit(0); // 입력을 못 읽으면 조용히 통과 (검사 때문에 작업을 막지 않는다)
}

const filePath = input?.tool_input?.file_path;
if (!filePath) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const absolute = path.resolve(root, filePath);
const relative = path.relative(root, absolute).split(path.sep).join('/');

// 프로젝트 밖 파일, node_modules, 컴파일 결과(css)는 검사하지 않는다.
if (relative.startsWith('..') || relative.includes('node_modules/')) process.exit(0);

const ext = path.extname(relative).toLowerCase();

if (ext === '.ts' || ext === '.tsx') {
    const tsc = run('npx', ['tsc', '-b'], root);
    if (tsc.status !== 0) fail('타입 오류 (npx tsc -b)', tsc);

    const lint = run('npx', ['eslint', `"${relative}"`], root);
    if (lint.status !== 0) fail(`린트 오류 (${relative})`, lint);
} else if (ext === '.scss') {
    // 어느 SCSS 가 바뀌어도 진입 파일을 컴파일해서 @use 연결까지 확인한다.
    const sass = run('npx', ['sass', '--no-source-map', '--no-color', 'src/styles/common.scss'], root);
    if (sass.status !== 0) fail(`SCSS 컴파일 오류 (${relative})`, { stdout: '', stderr: sass.stderr });
}

process.exit(0);
