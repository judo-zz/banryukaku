/**
 * arg.js — ARG engine for 蟠龍閣
 * Manages investigationLevel, search routing, and level-up effects.
 */

var ARG = (() => {
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
      showLvOverlay(target);
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
    location.reload();
  }

  // Boot
  function init() {
    applyLevel(getLevel());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { getLevel, setLevel, tryLevel, addFlag, hasFlag, getFlags, brReset };
})();

// ─── Search index ──────────────────────────────────────────────────────────

// dest: 遷移先, flag: 発見フラグ(パス基準で共有), level: 到達目標Lv
var SEARCH_INDEX = {
  'ゆめ':        { dest: 'hidden/yume-rireki.html',        flag: 'found_yume_rireki',     level: 1 },
  '夢':          { dest: 'hidden/yume-rireki.html',        flag: 'found_yume_rireki',     level: 1 },
  '黒瀬':        { dest: 'hidden/kurose-shiji.html',       flag: 'found_kurose',          level: 2 },
  '失敗作':      { dest: 'hidden/yume-finallog.html',      flag: 'found_yume_finallog',   level: 2 },
  '龍牌会':      { dest: 'hidden/ronpaikai-chart.html',    flag: 'found_ronpaikai',       level: 2 },
  'MAP-RY-023':  { dest: 'hidden/basement-map.html',       flag: 'found_basement_map',    level: 3 },
  'RENPAI':      { dest: 'hidden/backdoor.html',           flag: 'found_renpai',          level: 4 },
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

    if (isNewFind) {
      ARG.addFlag(flag);
      ARG.tryLevel(level);
    }

    const didLevelUp = ARG.getLevel() > prevLevel;
    const path = resolveSearchPath(dest);

    // Lvアップ演出（overlay）を視認してから遷移
    if (didLevelUp) {
      setTimeout(() => { window.location.href = path; }, 2000);
    } else {
      window.location.href = path;
    }
  } else {
    const el = document.getElementById('search-error');
    if (el) {
      el.textContent = '該当するデータが見つかりません。';
      setTimeout(() => { el.textContent = ''; }, 2000);
    }
  }
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

  if (!input || !btn) return;

  btn.addEventListener('click', () => executeSearch(input.value));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeSearch(input.value);
  });
});
