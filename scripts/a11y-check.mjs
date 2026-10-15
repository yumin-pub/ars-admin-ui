// Storybook의 모든 스토리를 실제 브라우저(Chromium)로 열어 axe-core 접근성 검사를 돌린다.
// 위반이 하나라도 있으면 종료 코드 1 → CI 실패.
// 사용: npm run build-storybook && node scripts/a11y-check.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const ROOT = join(process.cwd(), 'storybook-static');
const AXE_PATH = require.resolve('axe-core/axe.min.js');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

// storybook-static 폴더를 그대로 서빙하는 간단한 정적 서버
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const safe = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    const file = join(ROOT, safe === '/' ? 'index.html' : safe);
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(await readFile(join(ROOT, 'index.json'), 'utf-8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

// 브라우저 경로를 직접 지정해야 할 때만 PW_CHROMIUM_PATH 를 쓴다. (기본은 Playwright가 설치한 Chromium)
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const failures = [];
let checked = 0;

for (const story of stories) {
  const page = await browser.newPage();
  await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'load' });
  // 스토리가 그려질 때까지 대기 (에러 화면이면 아래에서 걸러진다)
  await page.waitForFunction(
    () => document.body.classList.contains('sb-show-main') || document.body.classList.contains('sb-show-errordisplay'),
    null,
    { timeout: 15000 },
  );
  if (await page.evaluate(() => document.body.classList.contains('sb-show-errordisplay'))) {
    failures.push({ id: story.id, title: story.title, error: '스토리 렌더링 에러' });
    await page.close();
    continue;
  }
  await page.addScriptTag({ path: AXE_PATH });
  const result = await page.evaluate(
    (tags) => window.axe.run('#storybook-root', { runOnly: { type: 'tag', values: tags } }),
    TAGS,
  );
  checked += 1;
  if (result.violations.length > 0) {
    failures.push({
      id: story.id,
      title: story.title,
      violations: result.violations.map((v) => ({
        rule: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
        count: v.nodes.length,
      })),
    });
  }
  await page.close();
}

await browser.close();
server.close();

console.log(`\n스토리 ${stories.length}개 중 ${checked}개 검사 완료`);
if (failures.length === 0) {
  console.log('접근성 위반 0건');
  process.exit(0);
}

console.error(`\n접근성 위반이 있는 스토리: ${failures.length}개\n`);
for (const f of failures) {
  console.error(`✗ ${f.title} (${f.id})`);
  if (f.error) console.error(`   ${f.error}`);
  for (const v of f.violations ?? []) {
    console.error(`   - [${v.impact}] ${v.rule}: ${v.help} (${v.count}곳)`);
    for (const n of v.nodes) console.error(`       ${n}`);
  }
}
process.exit(1);
