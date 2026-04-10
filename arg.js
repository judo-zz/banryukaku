/**
 * arg.js — ARG engine for 蟠龍閣
 * Manages investigationLevel, search routing, and level-up effects.
 */

const ARG = (() => {
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

  function showLvOverlay(level) {
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

const SEARCH_INDEX = {
  'ゆめ':          'hidden/yume-rireki.html',
  '夢':            'hidden/yume-rireki.html',
  '黒瀬':          'hidden/kurose-shiji.html',
  '失敗作':        'hidden/yume-finallog.html',
  '龍牌会':        'hidden/ronpaikai-chart.html',
  'MAP-RY-023':    'hidden/basement-map.html',
  'RENPAI':        'hidden/backdoor.html',
  '廃棄':          'hidden/disposal-record.html',
  '選定':          'hidden/selection-criteria.html',
  '龍牌会 端末':   'hidden/admin-console.html',
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

  const dest = SEARCH_INDEX[q];
  if (dest) {
    const flag = 'search_' + q;
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');

    if (!ARG.hasFlag(flag)) {
      ARG.addFlag(flag);
      ARG.tryLevel(ARG.getLevel() + 1);
    }

    if (input) input.disabled = true;
    if (btn) btn.disabled = true;

    window.location.href = resolveSearchPath(dest);
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
