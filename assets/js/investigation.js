// ============================================================
// 蟠龍閣 ARG — investigation.js
// investigationLevel system: localStorage-backed, CSS-variable-driven
// このファイルは <head> の末尾で読み込み、即時実行する
// ============================================================

const _BR_KEY   = 'banryu_level';  // design-system.css の main.js と共有
const _BR_FLAGS = 'banryu_flags';
const _BR_MAX   = 5;

// ── Favicon (SVG data URL, 各レベル) ────────────────────────
const _FAVICONS = [
  // Lv0: 赤提灯・通常
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='5' fill='%230d0608'/><text x='16' y='23' text-anchor='middle' font-size='22' fill='%23c9a84c' font-family='serif'>龍</text></svg>`,
  // Lv1: 金が滲む
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='5' fill='%230d0608'/><text x='16' y='23' text-anchor='middle' font-size='22' fill='%23f0d878' font-family='serif'>龍</text><line x1='10' y1='2' x2='14' y2='30' stroke='%23ff2244' stroke-width='0.8' opacity='0.5'/></svg>`,
  // Lv2: 青に侵食
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='5' fill='%230a0d12'/><text x='16' y='23' text-anchor='middle' font-size='22' fill='%2300cfff' font-family='serif' opacity='0.9'>龍</text></svg>`,
  // Lv3: 暗く・警告の目
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='5' fill='%23020505'/><text x='16' y='23' text-anchor='middle' font-size='22' fill='%2300a060' font-family='serif' opacity='0.7'>龍</text><circle cx='27' cy='5' r='3.5' fill='%23ff2244'/></svg>`,
  // Lv4: 断片化・崩壊
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='0' fill='%23010202'/><text x='15' y='22' text-anchor='middle' font-size='22' fill='%2300ff9f' font-family='serif' opacity='0.5'>龍</text><text x='18' y='25' text-anchor='middle' font-size='22' fill='%2300ff9f' font-family='serif' opacity='0.3'>龍</text></svg>`,
  // Lv5: 金の龍眼（最終形態）
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='0' fill='%23000200'/><ellipse cx='16' cy='16' rx='13' ry='8' fill='none' stroke='%23D4AF37' stroke-width='1.5'/><ellipse cx='16' cy='16' rx='4' ry='8' fill='%23D4AF37'/><ellipse cx='16' cy='16' rx='1.5' ry='4' fill='%23000200'/><circle cx='14' cy='13' r='1' fill='%23fff' opacity='0.6'/></svg>`,
];

// ── Tab title suffix per level ───────────────────────────────
const _TITLE_SUFFIX = [
  ' | CYBER CHINA',      // Lv0
  ' | CYBER CHINA',      // Lv1 (変化なし・気づかせない)
  ' | 君はもう、龍を見ている', // Lv2
  ' | 君はもう、龍を見ている', // Lv3
  ' | 次の龍はあなた',      // Lv4
  ' | Root Access Granted',  // Lv5
];

// ── Level-up notification messages ──────────────────────────
const _LV_MSG = {
  1: '何かが、変わった…',
  2: '彼女たちの顔が変わっていく',
  3: '扉が開いた',
  4: 'システムが、応答している',
  5: '——Root Access Granted.',
};

// ═══════════════════════════════════════════════════════════
// Core API
// ═══════════════════════════════════════════════════════════

function brGetLevel() {
  return Math.min(_BR_MAX, Math.max(0, parseInt(localStorage.getItem(_BR_KEY) ?? '0', 10)));
}

function brSetLevel(n) {
  const lv   = Math.min(_BR_MAX, Math.max(0, n));
  const prev = brGetLevel();
  localStorage.setItem(_BR_KEY, String(lv));
  _brApplyDOM(lv);
  _brUpdateFavicon(lv);
  _brUpdateTitle(lv);
  if (lv > prev) {
    _brShowLevelUp(lv);
    if (typeof brPlayGlitch === 'function') brPlayGlitch();
  }
  window.dispatchEvent(new CustomEvent('br:level', { detail: { level: lv, prev } }));
}

function brTryLevel(target) {
  const cur = brGetLevel();
  if (cur >= target) return false;   // already at or past
  if (cur < target - 1) return false; // cannot skip levels
  brSetLevel(target);
  return true;
}

// ── Flags ────────────────────────────────────────────────────
function brGetFlags() {
  try { return JSON.parse(localStorage.getItem(_BR_FLAGS) ?? '[]'); }
  catch { return []; }
}

function brAddFlag(f) {
  const flags = brGetFlags();
  if (flags.includes(f)) return;
  flags.push(f);
  localStorage.setItem(_BR_FLAGS, JSON.stringify(flags));
}

function brHasFlag(f) { return brGetFlags().includes(f); }

// 選択済み秘密テキストの数を返す
function brSecretCount() {
  return brGetFlags().filter(f => f.startsWith('secret_')).length;
}

// ── DOM / Favicon / Title ────────────────────────────────────
function _brApplyDOM(lv) {
  // data-level on <html> → for assets/css/main.css selectors
  document.documentElement.dataset.level = String(lv);
  // body.lv${n} → for design-system.css selectors (applied when body exists)
  const body = document.body;
  if (body) {
    for (let i = 0; i <= 5; i++) body.classList.remove(`lv${i}`);
    if (lv > 0) body.classList.add(`lv${lv}`);
  }
}

function _brUpdateFavicon(lv) {
  let el = document.querySelector("link[rel~='icon']");
  if (!el) { el = document.createElement('link'); el.rel = 'icon'; document.head.appendChild(el); }
  el.href = _FAVICONS[lv];
}

function _brUpdateTitle(lv) {
  const titleEl = document.querySelector('title');
  if (!titleEl) return;
  const base = titleEl.dataset.base || titleEl.textContent;
  titleEl.dataset.base = base;
  document.title = base + _TITLE_SUFFIX[lv];
}

// ── Level-up overlay ─────────────────────────────────────────
function _brShowLevelUp(lv) {
  const el = document.createElement('div');
  el.className = 'br-lv-overlay';
  el.innerHTML = `
    <div class="br-lv-inner">
      <div class="br-lv-num">Lv.${lv}</div>
      <div class="br-lv-msg">${_LV_MSG[lv] ?? ''}</div>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('br-lv-overlay--in'));
  setTimeout(() => {
    el.classList.remove('br-lv-overlay--in');
    setTimeout(() => el.remove(), 700);
  }, 2400);
}

// ═══════════════════════════════════════════════════════════
// Trigger Helpers（各ページから呼ぶ）
// ═══════════════════════════════════════════════════════════

// 白文字（秘密テキスト）の選択検出
// secretId: 'cast_miju' のような一意な文字列
// onFound: オプションのコールバック
function brInitSecret(secretId, onFound) {
  if (brHasFlag(`secret_${secretId}`)) {
    onFound && onFound(brSecretCount());
    return;
  }
  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const node = sel.anchorNode?.parentElement;
    if (!node?.closest(`[data-secret="${secretId}"]`)) return;
    brAddFlag(`secret_${secretId}`);
    onFound && onFound(brSecretCount());
    // Lv1→2: 秘密テキストを2つ以上発見
    if (brSecretCount() >= 2) brTryLevel(2);
  });
}

// 3秒長押し検出
function brInitLongPress(selector, flag, onActivate, ms = 3000) {
  const el = document.querySelector(selector);
  if (!el) return;
  let timer = null;
  let bar   = null;

  const start = () => {
    if (brHasFlag(flag)) { onActivate && onActivate(); return; }
    bar = _brCreateProgress(el, ms);
    timer = setTimeout(() => {
      bar?.remove(); bar = null;
      brAddFlag(flag);
      onActivate && onActivate();
    }, ms);
  };
  const cancel = () => {
    clearTimeout(timer); timer = null;
    bar?.remove(); bar = null;
  };

  el.addEventListener('mousedown', start);
  el.addEventListener('touchstart', start, { passive: true });
  ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => el.addEventListener(ev, cancel));
}

function _brCreateProgress(anchor, ms) {
  const bar  = document.createElement('div');
  bar.className = 'br-progress-bar';
  const fill = document.createElement('div');
  fill.className = 'br-progress-fill';
  fill.style.transition = `width ${ms}ms linear`;
  bar.appendChild(fill);
  anchor.after(bar);
  requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = '100%'; }));
  return bar;
}

// スクロール深度検出
function brInitScrollDepth(pct, flag, targetLevel) {
  if (brHasFlag(flag)) { brTryLevel(targetLevel); return; }
  const check = () => {
    const d = document.documentElement;
    if ((d.scrollHeight - d.clientHeight) <= 0) return;
    const scrolled = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100;
    if (scrolled >= pct) {
      window.removeEventListener('scroll', check, { passive: true });
      brAddFlag(flag);
      brTryLevel(targetLevel);
    }
  };
  window.addEventListener('scroll', check, { passive: true });
}

// ページ滞在タイマー
function brInitPageTimer(seconds, flag, targetLevel) {
  if (brHasFlag(flag)) { brTryLevel(targetLevel); return; }
  let elapsed = 0;
  const fill = document.querySelector('#br-timer-bar .br-progress-fill');
  if (fill) fill.style.transition = `width ${seconds}s linear`;

  const iv = setInterval(() => {
    elapsed++;
    if (fill) fill.style.width = (elapsed / seconds * 100) + '%';
    if (elapsed >= seconds) {
      clearInterval(iv);
      brAddFlag(flag);
      brTryLevel(targetLevel);
    }
  }, 1000);
}

// 滞在時間（サイト全体・トップ用）
function brInitSiteTimer(minutes, flag) {
  if (brHasFlag(flag)) return;
  setTimeout(() => {
    brAddFlag(flag);
    // Lv0→1: タイマー OR 白文字（どちらか先）
    if (brGetLevel() < 1) brTryLevel(1);
  }, minutes * 60 * 1000);
}

// DevTools コンソールヒント
function brInitConsoleHint(msg) {
  const threshold = 160;
  const iv = setInterval(() => {
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
      clearInterval(iv);
      console.log(`%c${msg}`, 'color:#00ff9f;font-size:13px;font-family:monospace;background:#000;padding:6px 14px;border-left:3px solid #00ff9f');
      // HTMLコメント発見フラグ（DevTools open = ソース確認とみなす）
      if (!brHasFlag('devtools_opened')) {
        brAddFlag('devtools_opened');
        brTryLevel(3); // Lv2→3 の条件の一つ
      }
    }
  }, 800);
}

// パスワードゲート
// correctEncoded: btoa(正解) ── UkVOUEFJ = btoa('RENPAI')
function brInitPasswordGate(inputSel, btnSel, correctEncoded, onSuccess) {
  const input = document.querySelector(inputSel);
  const btn   = document.querySelector(btnSel);
  if (!input || !btn) return;

  const attempt = () => {
    const val = input.value.trim().toUpperCase();
    try {
      if (btoa(val) === correctEncoded) {
        onSuccess(val);
      } else {
        input.classList.add('br-shake');
        input.addEventListener('animationend', () => input.classList.remove('br-shake'), { once: true });
        input.value = '';
        input.placeholder = '……違う';
      }
    } catch { /* btoa error (non-latin) */ }
  };

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
}

// ═══════════════════════════════════════════════════════════
// Init（script読み込み直後に即時実行 → レンダリング前にdata-levelを設定）
// ═══════════════════════════════════════════════════════════
(function brInit() {
  const lv = brGetLevel();
  // <html> data-level は即時設定（body未存在でも動く）
  document.documentElement.dataset.level = String(lv);
  _brUpdateFavicon(lv);
  _brUpdateTitle(lv);
  // body.lv クラスは DOM 構築後に付与
  if (document.body) {
    _brApplyDOM(lv);
  } else {
    document.addEventListener('DOMContentLoaded', () => _brApplyDOM(lv), { once: true });
  }
})();

// デバッグ用（コンソールで brReset() を実行）
window.brReset = () => {
  localStorage.removeItem(_BR_KEY);
  localStorage.removeItem(_BR_FLAGS);
  location.reload();
};
