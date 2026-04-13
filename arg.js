/**
 * arg.js — ARG engine for 蟠龍閣
 * Manages investigationLevel, search routing, and level-up effects.
 */

var ARG = (() => {
  // 紹介コード未解放なら即座にCSSで検索バーを隠す（DOMContentLoaded待ちなしで確実に非表示）
  if (!localStorage.getItem('br_referral')) {
    var _hide = document.createElement('style');
    _hide.id = 'arg-search-hide';
    _hide.textContent = '#search-area,#hd-search{display:none!important}';
    document.head.appendChild(_hide);
  }

  const STORAGE_KEY = 'br_level';
  const FLAGS_KEY   = 'br_flags';

  const LEVEL_TITLES = {
    0: '',
    1: ' ——龍、目覚む',
    2: ' ——深淵を覗く',
    3: ' ——真実の螺旋',
    4: ' ——禁忌の回廊',
    5: ' ——蟠龍、解放',
  };

  // SVG favicon circle colors per level
  const LEVEL_COLORS = {
    0: '#8b1a1a',
    1: '#a02020',
    2: '#c04040',
    3: '#00cfff',
    4: '#7b2fff',
    5: '#ff6600',
  };

  function getLevel() {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  }

  function setLevel(n) {
    const level = Math.max(0, Math.min(5, n));
    localStorage.setItem(STORAGE_KEY, String(level));
    applyLevel(level);
  }

  // Advance to target only if it's higher than current
  function tryLevel(target) {
    if (target > getLevel()) {
      setLevel(target);
    }
  }

  function addFlag(f) {
    const flags = getFlags();
    if (!flags.includes(f)) {
      flags.push(f);
      localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
    }
  }

  function hasFlag(f) {
    return getFlags().includes(f);
  }

  function getFlags() {
    try {
      return JSON.parse(localStorage.getItem(FLAGS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function applyLevel(level) {
    document.documentElement.setAttribute('data-level', String(level));
    updateFavicon(level);
    updateTitle(level);
    updateLevelIndicator(level);
    updateMonitor(level);
  }

  // ─── Lv3以降：検索文言テーブル ─────────────────────────────────
  const SEARCH_FAIL_LV3 = [
    '該当データなし。検索行動を記録しました。',
    '該当語は選定対象外です。',
    '閲覧権限を照合中です。',
    '検索履歴を候補者ログへ転記しました。',
    '未登録語です。継続探索を推奨します。',
    '入力傾向を解析しています。',
    '外部探索パターンを確認。基準内です。',
    '検索結果なし。反応速度のみ記録しました。',
  ];

  const SEARCH_OK_LV3 = [
    '制限層へのアクセスを許可しました。',
    '候補者適性に応じて表示内容を更新しました。',
    '閲覧権限が一段階拡張されました。',
    '深層記録への接続を確認。',
    '到達条件を満たしました。次層を開示します。',
  ];

  const MONITOR_LINES = [
    'monitoring route...',
    'subject trace active',
    'persistence: sufficient',
    'curiosity score updated',
    'succession protocol pending',
  ];

  function getFailMsg() {
    if (getLevel() >= 3) {
      return SEARCH_FAIL_LV3[Math.floor(Math.random() * SEARCH_FAIL_LV3.length)];
    }
    return '該当するデータが見つかりません。';
  }

  function getOkMsg() {
    if (getLevel() >= 3) {
      return SEARCH_OK_LV3[Math.floor(Math.random() * SEARCH_OK_LV3.length)];
    }
    return null;
  }

  // ─── Level indicator ────────────────────────────────────────────
  function ensureUI() {
    if (document.getElementById('arg-ui-css')) return;

    // CSS
    const s = document.createElement('style');
    s.id = 'arg-ui-css';
    s.textContent =
      '#arg-level-indicator{' +
        'position:fixed;bottom:14px;right:14px;z-index:9000;' +
        'background:rgba(0,0,0,0.70);border:1px solid rgba(180,140,60,0.35);' +
        'color:#c9a84c;font-family:monospace;font-size:12px;' +
        'letter-spacing:0.18em;padding:5px 10px;pointer-events:none;' +
        'user-select:none;line-height:1;' +
      '}' +
      '#arg-disclaimer{' +
        'text-align:center;font-family:monospace;font-size:10px;' +
        'color:rgba(120,100,80,0.55);padding:18px 12px 10px;' +
        'letter-spacing:0.05em;line-height:1.8;' +
      '}' +
      '#arg-monitor{' +
        'display:none;position:fixed;bottom:38px;right:14px;z-index:8999;' +
        'font-family:monospace;font-size:10px;color:rgba(80,160,80,0.35);' +
        'letter-spacing:0.12em;pointer-events:none;user-select:none;' +
      '}';
    document.head.appendChild(s);

    // indicator
    const ind = document.createElement('div');
    ind.id = 'arg-level-indicator';
    document.body.appendChild(ind);

    // disclaimer
    if (!document.getElementById('arg-disclaimer')) {
      const disc = document.createElement('div');
      disc.id = 'arg-disclaimer';
      disc.textContent =
        'このWebサイトの内容はフィクションであり、実在の人物・団体・施設とは一切関係がありません。';
      document.body.appendChild(disc);
    }

    // monitor line (Lv3以降で表示)
    if (!document.getElementById('arg-monitor')) {
      const mon = document.createElement('div');
      mon.id = 'arg-monitor';
      document.body.appendChild(mon);
    }
  }

  function updateMonitor(level) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateMonitor(level));
      return;
    }
    ensureUI();
    const mon = document.getElementById('arg-monitor');
    if (!mon) return;
    if (level >= 3) {
      const line = MONITOR_LINES[Math.floor(Math.random() * MONITOR_LINES.length)];
      mon.textContent = line;
      mon.style.display = 'block';
    } else {
      mon.style.display = 'none';
    }
  }

  function updateLevelIndicator(level) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateLevelIndicator(level));
      return;
    }
    ensureUI();
    const ind = document.getElementById('arg-level-indicator');
    if (ind) ind.textContent = '◆'.repeat(level) + '◇'.repeat(5 - level);
  }

  function updateFavicon(level) {
    const color = LEVEL_COLORS[level] || LEVEL_COLORS[0];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${color}"/>
      <text x="16" y="21" text-anchor="middle" font-size="16" fill="#f5eed7" font-family="serif">龍</text>
    </svg>`;
    const url = 'data:image/svg+xml,' + encodeURIComponent(svg);
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  function updateTitle(level) {
    const suffix = LEVEL_TITLES[level] || '';
    const base = document.title
      .replace(/ ——.*$/, '')  // strip existing suffix
      .trim();
    document.title = base + suffix;
  }

  function ensureOverlayCss() {
    if (document.getElementById('arg-overlay-css')) return;
    const s = document.createElement('style');
    s.id = 'arg-overlay-css';
    s.textContent =
      '.lv-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;' +
      'justify-content:center;background:rgba(0,0,0,.88);opacity:0;pointer-events:none;' +
      'transition:opacity .4s ease}' +
      '.lv-overlay.lv-overlay--visible{opacity:1;pointer-events:all}' +
      '.lv-overlay__inner{text-align:center;transform:scale(.9);' +
      'transition:transform .5s cubic-bezier(.23,1,.32,1)}' +
      '.lv-overlay.lv-overlay--visible .lv-overlay__inner{transform:scale(1)}' +
      '.lv-overlay__num{font-family:monospace;font-size:.75rem;letter-spacing:.4em;' +
      'color:#c9a84c;margin-bottom:.5rem}' +
      '.lv-overlay__msg{font-size:clamp(1.2rem,3vw,1.8rem);color:#f5eed7;letter-spacing:.1em}';
    document.head.appendChild(s);
  }

  function showLvOverlay(level) {
    ensureOverlayCss();
    const existing = document.querySelector('.lv-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'lv-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('div');
    inner.className = 'lv-overlay__inner';

    const num = document.createElement('p');
    num.className = 'lv-overlay__num';
    num.textContent = `LV ${level}`;
    inner.appendChild(num);

    const msg = document.createElement('p');
    msg.className = 'lv-overlay__msg';
    msg.textContent = `調査レベル ${level} に到達`;
    inner.appendChild(msg);

    overlay.appendChild(inner);

    document.body.appendChild(overlay);

    // Force reflow then trigger fade-in
    void overlay.offsetWidth;
    overlay.classList.add('lv-overlay--visible');

    setTimeout(() => {
      overlay.classList.remove('lv-overlay--visible');
      setTimeout(() => overlay.remove(), 600);
    }, 2200);
  }

  // Debug: reset everything
  function brReset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FLAGS_KEY);
    localStorage.removeItem(REFERRAL_KEY);
    localStorage.removeItem('blog_pass_unlocked');
    localStorage.removeItem('br_clear_date');
    window.location.href = resolveSearchPath('index.html');
  }

  // Boot
  // ─── 紹介コード / 検索バー解放 ─────────────────────────────────────────
  const REFERRAL_KEY  = 'br_referral';
  const REFERRAL_CODE = 'BANRYUKAKU';

  function isSearchUnlocked() {
    return !!localStorage.getItem(REFERRAL_KEY);
  }

  function unlockSearch() {
    localStorage.setItem(REFERRAL_KEY, '1');
    // CSSによる非表示を解除
    const hide = document.getElementById('arg-search-hide');
    if (hide) hide.remove();
    // 念のためインラインstyleも解除
    ['search-area', 'hd-search'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
  }

  function applySearchVisibility() {
    if (isSearchUnlocked()) return; // 解放済みなら何もしない
    ['search-area', 'hd-search'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function checkReferral(input) {
    return input.trim().toUpperCase() === REFERRAL_CODE;
  }

  function init() {
    applyLevel(getLevel());
    applySearchVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { getLevel, setLevel, tryLevel, addFlag, hasFlag, getFlags, getFailMsg, getOkMsg, brReset, isSearchUnlocked, unlockSearch, checkReferral };
})();

// ─── Search index ──────────────────────────────────────────────────────────

// dest: 遷移先, flag: 発見フラグ(パス基準で共有), level: 到達目標Lv
var SEARCH_INDEX = {
  'ゆめ':        { dest: 'hidden/yume-notice.html',         flag: 'found_yume_notice',     level: 1 },
  '夢':          { dest: 'hidden/yume-notice.html',         flag: 'found_yume_notice',     level: 1 },
  '復元':        { dest: 'hidden/yume-draft.html',          flag: 'found_yume_draft',      level: 1 },
  '復元ファイル': { dest: 'hidden/yume-draft.html',          flag: 'found_yume_draft',      level: 1 },
  'buffer04.dat': { dest: 'hidden/yume-draft.html',         flag: 'found_yume_draft',      level: 1 },
  'YM-2023-04':  { dest: 'hidden/yume-rireki.html',        flag: 'found_yume_rireki',     level: 2 },
  '黒瀬':        { dest: 'hidden/kurose-shiji.html',       flag: 'found_kurose',          level: 2 },
  '失敗作':      { dest: 'hidden/yume-finallog.html',      flag: 'found_yume_finallog',   level: 2 },
  '龍牌会':      { dest: 'hidden/ronpaikai-chart.html',    flag: 'found_ronpaikai',       level: 2,
                   requires: ['found_yume_rireki', 'found_kurose', 'found_yume_finallog'],
                   failMsg: 'アクセス拒否。調査が不足しています。' },
  'MAP-RY-023':  { dest: 'hidden/basement-map.html',       flag: 'found_basement_map',    level: 3 },
  '龍牌会の端末': { dest: 'hidden/admin-console.html',      flag: 'found_admin_console',   level: 3 },
  'RENPAI':      { dest: 'hidden/backdoor.html',           flag: 'found_renpai',          level: 4 },
  'renpai':      { dest: 'hidden/backdoor.html',           flag: 'found_renpai',          level: 4 },
  '廃棄':        { dest: 'hidden/disposal-record.html',    flag: 'found_disposal',        level: 3 },
  '選定':        { dest: 'hidden/selection-criteria.html', flag: 'found_selection',       level: 3 },
  '龍牌会 端末': { dest: 'hidden/admin-console.html',      flag: 'found_admin_console',   level: 4 },
};

function resolveSearchPath(dest) {
  const cleanDest = dest.replace(/^\/+/, '');
  const path = window.location.pathname;
  const currentDir = path.endsWith('/')
    ? path
    : path.slice(0, path.lastIndexOf('/') + 1);
  const segments = currentDir.split('/').filter(Boolean);
  const hiddenIndex = segments.indexOf('hidden');
  const depth = hiddenIndex === -1 ? 0 : segments.length - hiddenIndex;
  return '../'.repeat(depth) + cleanDest;
}

function executeSearch(query) {
  const q = query.trim();
  if (!q) return;

  const entry = SEARCH_INDEX[q];
  if (entry) {
    const { dest, flag, level } = entry;
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');

    if (input) input.disabled = true;
    if (btn) btn.disabled = true;

    const isNewFind  = !ARG.hasFlag(flag);
    const prevLevel  = ARG.getLevel();

    // 前提フラグ未達の場合は遷移しない
    if (entry.requires && !entry.requires.every(f => ARG.hasFlag(f))) {
      const el = document.getElementById('search-error');
      if (el) {
        el.style.color = '';
        el.textContent = entry.failMsg || ARG.getFailMsg();
        setTimeout(() => { el.textContent = ''; }, 2200);
      }
      if (input) input.disabled = false;
      if (btn) btn.disabled = false;
      return;
    }

    // 前提レベル未達の場合はキーワードを知らないはずなので遷移しない
    if (prevLevel < level - 1) {
      const el = document.getElementById('search-error');
      if (el) {
        el.style.color = '';
        el.textContent = ARG.getFailMsg();
        setTimeout(() => { el.textContent = ''; }, 2200);
      }
      if (input) input.disabled = false;
      if (btn) btn.disabled = false;
      return;
    }

    if (isNewFind) {
      ARG.addFlag(flag);
      ARG.tryLevel(level);
    }

    // Lv3以降は成功メッセージを一瞬表示してから遷移
    const okMsg = ARG.getOkMsg();
    if (okMsg) {
      const el = document.getElementById('search-error');
      if (el) {
        el.style.color = 'rgba(80,160,80,0.8)';
        el.textContent = okMsg;
      }
      setTimeout(() => {
        const path = resolveSearchPath(dest);
        window.location.href = path;
      }, 700);
    } else {
      const path = resolveSearchPath(dest);
      window.location.href = path;
    }
  } else {
    const el = document.getElementById('search-error');
    if (el) {
      el.style.color = '';
      el.textContent = ARG.getFailMsg();
      setTimeout(() => { el.textContent = ''; }, 2200);
    }
  }
}

// ─── Investigation progress bar (hidden pages only) ────────────────────────

const PROGRESS_FLAGS = [
  'found_yume_notice',
  'found_yume_draft',
  'found_kurose',
  'found_yume_rireki',
  'found_yume_finallog',
  'found_ronpaikai',
  'found_basement_map',
  'found_admin_console',
  'found_renpai',
  'admin_transfer_complete',
];

function injectProgressBar() {
  if (!window.location.pathname.includes('/hidden/')) return;

  const flags = ARG.getFlags();
  const found = PROGRESS_FLAGS.filter(f => flags.includes(f)).length;
  const total = PROGRESS_FLAGS.length;
  const pct   = Math.round((found / total) * 100);

  const filled = Math.round(found / total * 10);
  const bar    = '█'.repeat(filled) + '░'.repeat(10 - filled);

  const el = document.createElement('div');
  el.id = 'arg-progress';
  el.style.cssText = [
    'position:fixed', 'bottom:14px', 'left:12px',
    'font-family:monospace', 'font-size:10px',
    'color:#444433', 'letter-spacing:0.05em',
    'pointer-events:none', 'z-index:9000',
    'user-select:none',
  ].join(';');
  el.textContent = `調査進捗 ${bar} ${pct}%`;
  document.body.appendChild(el);
}

// ─── Search bar wiring ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const btn   = document.getElementById('search-btn');
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open');
    });
  }

  injectProgressBar();

  if (!input || !btn) return;

  btn.addEventListener('click', () => executeSearch(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeSearch(input.value);
  });
});
