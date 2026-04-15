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

  const STORAGE_KEY    = 'br_level';
  const FLAGS_KEY      = 'br_flags';
  const SEARCH_LOG_KEY = 'br_search_log';

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
        'position:fixed;bottom:60px;right:14px;z-index:9000;' +
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
    if (ind) {
      let visited = '';
      try { visited = '  ' + (JSON.parse(localStorage.getItem(PAGE_VISIT_KEY) || '[]')).length + '/' + PAGE_TOTAL; } catch(e) {}
      ind.textContent = '◆'.repeat(level) + '◇'.repeat(5 - level) + visited;
    }
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

  // ─── 検索ログ ──────────────────────────────────────────────────────────────
  function logSearch(query) {
    const raw  = localStorage.getItem(SEARCH_LOG_KEY);
    const log  = raw ? JSON.parse(raw) : [];
    const ts   = new Date().toLocaleTimeString('ja-JP');
    log.push({ ts, query });
    localStorage.setItem(SEARCH_LOG_KEY, JSON.stringify(log));
  }

  function getSearchLog() {
    const raw = localStorage.getItem(SEARCH_LOG_KEY);
    const log = raw ? JSON.parse(raw) : [];
    if (log.length === 0) { console.log('[ARG] 検索ログなし'); return []; }
    console.log('[ARG] 検索ログ (' + log.length + '件):');
    log.forEach(function(e, i) {
      console.log('  ' + (i + 1) + '. [' + e.ts + '] ' + e.query);
    });
    return log;
  }

  function clearSearchLog() {
    localStorage.removeItem(SEARCH_LOG_KEY);
    console.log('[ARG] 検索ログをクリアしました');
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

  return { getLevel, setLevel, tryLevel, addFlag, hasFlag, getFlags, getFailMsg, getOkMsg, brReset, isSearchUnlocked, unlockSearch, checkReferral, logSearch, getSearchLog, clearSearchLog };
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
  '選定審査':    { dest: 'hidden/selection-review.html',   flag: 'found_selection_review', level: 2,
                   requires: ['found_yume_rireki', 'found_kurose'],
                   failMsg: '審査対象の記録が未参照です。関係者の情報を先に確認してください。' },
  '龍牌会':      { dest: 'hidden/ronpaikai-chart.html',    flag: 'found_ronpaikai',       level: 2,
                   requires: ['found_yume_rireki', 'found_kurose', 'found_yume_finallog'],
                   failMsg: 'アクセス拒否。調査が不足しています。' },
  'MAP-RY-023':  { dest: 'hidden/basement-map.html',       flag: 'found_basement_map',    level: 3 },
  '龍牌会の端末': { dest: 'hidden/admin-console.html',      flag: 'found_admin_console',   level: 3 },
  '管理端末':    { dest: 'hidden/admin-console.html',      flag: 'found_admin_console',   level: 3 },
  'RENPAI':      { dest: 'hidden/backdoor.html',           flag: 'found_renpai',          level: 4,
                   requires: ['found_blog_unlocked'], failMsg: '不正なアクセスです。先に表層の記録を参照してください。' },
  'renpai':      { dest: 'hidden/backdoor.html',           flag: 'found_renpai',          level: 4,
                   requires: ['found_blog_unlocked'], failMsg: '不正なアクセスです。先に表層の記録を参照してください。' },
  '廃棄処理室':       { dest: 'hidden/disposal-room-log.html',  flag: 'found_disposal_room',   level: 3 },
  'BRK-DSP-2026-0103': { dest: 'hidden/disposal-record.html',    flag: 'found_disposal',        level: 3,
                          requires: ['found_disposal_room'], failMsg: '該当する記録が見つかりません。先に区画情報を確認してください。' },
  '次代の総龍':  { dest: 'hidden/selection-criteria.html', flag: 'found_selection',       level: 3 },
  '龍牌会 端末': { dest: 'hidden/admin-console.html',      flag: 'found_admin_console',   level: 4 },
  '記録保管室':  { dest: 'hidden/lore-01.html',            flag: 'found_records_archive', level: 2 },
  '記録保管':    { dest: 'hidden/lore-01.html',            flag: 'found_records_archive', level: 2 },
  '第三区画':    { dest: 'hidden/shelve-lock.html',          flag: 'found_third_section',   level: 3,
                   requires: ['found_nagasawa'], failMsg: '該当する区画情報が見つかりません。先に関連資料を確認してください。' },
  '施錠棚':      { dest: 'hidden/shelve-lock.html',          flag: 'found_third_section',   level: 3,
                   requires: ['found_nagasawa'], failMsg: '該当する区画情報が見つかりません。先に関連資料を確認してください。' },
  '長谷川':      { dest: 'hidden/hasegawa.html',             flag: 'found_nagasawa',        level: 3,
                   requires: ['found_records_archive'], failMsg: '関連する記録が未参照です。記録保管室を先に確認してください。' },
  '長岡':        { dest: 'hidden/nagaoka.html',             flag: 'found_nagaoka',         level: 3,
                   requires: ['found_disposal'], failMsg: '関連する記録が未参照です。廃棄記録を先に確認してください。' },
  '百瀬':        { dest: 'hidden/momose.html',              flag: 'found_momose',          level: 3,
                   requires: ['found_disposal'], failMsg: '関連する記録が未参照です。廃棄記録を先に確認してください。' },
  '先代':        { deleted: true },
  '先代総龍':    { deleted: true },
  '前任者':      { deleted: true },
  '前総龍':      { deleted: true },
  'ソラ':        { deleted: true },
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

var YUME_MSG = {
  'found_yume_notice':   '……見つけてくれたんだ',
  'found_yume_draft':    'まだ残ってた',
  'found_yume_finallog': '最後まで読んでくれて、ありがとう',
  'found_selection_review': '……あの夜、本当はあなたに来てほしかった',
  'found_renpai':        'ここまで来たんだね'
};

function showUnsealedEffect(flag, callback) {
  // glitch: 一瞬色反転
  document.body.style.filter = 'invert(1)';
  setTimeout(function () {
    document.body.style.filter = 'none';

    // RECORD UNSEALED オーバーレイ
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;' +
      'flex-direction:column;z-index:99998;opacity:0;transition:opacity 0.3s;pointer-events:none;';
    ov.innerHTML = '<div style="color:#cc9944;font-family:monospace;font-size:15px;' +
      'letter-spacing:0.35em;text-shadow:0 0 8px rgba(200,160,60,0.5);">RECORD UNSEALED</div>';
    document.body.appendChild(ov);
    setTimeout(function () { ov.style.opacity = '1'; }, 30);

    var yumeText = YUME_MSG[flag];
    var totalDelay = yumeText ? 900 : 900;

    setTimeout(function () {
      if (yumeText) {
        var ym = document.createElement('div');
        ym.style.cssText = 'color:#998866;font-family:monospace;font-size:12px;' +
          'margin-top:16px;letter-spacing:0.15em;opacity:0;transition:opacity 0.4s;';
        ym.textContent = 'ゆめ：「' + yumeText + '」';
        ov.appendChild(ym);
        setTimeout(function () { ym.style.opacity = '1'; }, 30);
      }
    }, totalDelay);

    var closeDelay = yumeText ? 1900 : 1200;
    setTimeout(function () {
      ov.style.opacity = '0';
      setTimeout(function () { ov.remove(); callback(); }, 300);
    }, closeDelay);
  }, 150);
}

function executeSearch(query) {
  const q = query.trim();
  if (!q) return;
  ARG.logSearch(q);

  const entry = SEARCH_INDEX[q];

  // 削除済みレコード
  if (entry && entry.deleted) {
    var el = document.getElementById('search-error');
    if (el) {
      el.style.color = '#554433';
      el.innerHTML =
        '> ' + q + ' に関する記録は存在しません。<br>' +
        '> STATUS: DELETED — 2024.11 / 操作者: HSGW';
      setTimeout(function () { el.innerHTML = ''; el.style.color = ''; }, 4000);
    }
    return;
  }

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

    // STEP2: 3フラグ進捗表示
    const step2Flags = ['found_yume_rireki', 'found_kurose', 'found_yume_finallog'];
    if (isNewFind && step2Flags.indexOf(flag) !== -1) {
      const remaining = step2Flags.filter(f => !ARG.hasFlag(f)).length;
      if (remaining > 0) {
        const el = document.getElementById('search-error');
        if (el) {
          el.style.color = 'rgba(80,160,80,0.8)';
          el.textContent = '調査は3方向から進行中。残り: ' + remaining + '件';
        }
        setTimeout(() => { window.location.href = resolveSearchPath(dest); }, 1200);
        if (input) input.disabled = false;
        if (btn) btn.disabled = false;
        return;
      }
    }

    // レベルアップ検出（tryLevel呼び出し後に確認）
    const didLevelUp = isNewFind && ARG.getLevel() > prevLevel;

    // Lv3以降は成功メッセージを表示
    const okMsg = ARG.getOkMsg();
    if (okMsg) {
      const el = document.getElementById('search-error');
      if (el) {
        el.style.color = 'rgba(80,160,80,0.8)';
        el.textContent = okMsg;
      }
    }

    // 新規発見時は RECORD UNSEALED 演出チェーンで遷移
    if (isNewFind) {
      const redirectDelay = didLevelUp ? 1500 : 0;
      setTimeout(function () {
        showUnsealedEffect(flag, function () {
          window.location.href = resolveSearchPath(dest);
        });
      }, redirectDelay);
      return;
    }

    // 既知フラグ（再訪）は即遷移 or okMsg待ち
    const delay = okMsg ? 700 : 0;
    if (delay > 0) {
      setTimeout(() => { window.location.href = resolveSearchPath(dest); }, delay);
    } else {
      window.location.href = resolveSearchPath(dest);
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
  'found_selection_review',
  'found_ronpaikai',
  'found_basement_map',
  'found_admin_console',
  'found_renpai',
  'admin_transfer_complete',
];

const PAGE_VISIT_KEY = 'br_pages';
const PAGE_TOTAL = 31;

function recordPageVisit() {
  const path = window.location.pathname.replace(/.*\/banryukaku\//, '').replace(/^\//, '') || 'index.html';
  let visited;
  try { visited = JSON.parse(localStorage.getItem(PAGE_VISIT_KEY)) || []; } catch(e) { visited = []; }
  if (!visited.includes(path)) {
    visited.push(path);
    localStorage.setItem(PAGE_VISIT_KEY, JSON.stringify(visited));
  }
  return visited.length;
}

function injectProgressBar() {
  const visitedCount = recordPageVisit();
  const level = ARG.getLevel();
  const ind = document.getElementById('arg-level-indicator');
  if (ind) {
    ind.textContent = '◆'.repeat(level) + '◇'.repeat(5 - level) + '  ' + visitedCount + '/' + PAGE_TOTAL;
  }
}

// ─── Search bar wiring ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // 招待リンクからのアクセス
  if (new URLSearchParams(window.location.search).get('ref') === '1' && !ARG.isSearchUnlocked()) {
    ARG.unlockSearch();
  }

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

  // Lv3以上でブログPASSウィジェットを強調
  if (ARG.getLevel() >= 3 && !localStorage.getItem('blog_pass_unlocked')) {
    const passInput = document.getElementById('blog-pass-input');
    const passBtn   = document.getElementById('blog-pass-btn');
    if (passInput) {
      passInput.style.borderColor = 'rgba(200,160,60,0.5)';
      passInput.style.boxShadow   = '0 0 8px rgba(200,160,60,0.2)';
    }
    if (passBtn) {
      passBtn.style.borderColor = 'rgba(200,160,60,0.5)';
      passBtn.style.boxShadow   = '0 0 8px rgba(200,160,60,0.2)';
    }
  }

  if (!input || !btn) return;

  btn.addEventListener('click', () => executeSearch(input.value));

  // iOSキーボードの「Go」ボタン → search イベントを発火する
  input.addEventListener('search', () => executeSearch(input.value));

  // keyup を使う（Android Chromeはkeydownがcompositionendより先に来るため）
  // e.isComposing で変換中を除外
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.isComposing) executeSearch(input.value);
  });

  // bfcache対策: 戻るボタンでページが復元されたとき disabled を解除する
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      input.disabled = false;
      btn.disabled = false;
    }
  });

  // hidden/ページ全体のスマホ向け検索バーCSS（各ページのインラインCSSを上書き）
  if (!document.getElementById('arg-mobile-search-css')) {
    const s = document.createElement('style');
    s.id = 'arg-mobile-search-css';
    s.textContent =
      '@media (max-width:600px){' +
        '#hd-search{padding:8px 10px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;}' +
        '#hd-search input[type="search"]{font-size:16px!important;padding:10px 8px!important;' +
          'width:calc(100% - 90px)!important;min-width:0;box-sizing:border-box;}' +
        '#hd-search button{font-size:16px!important;padding:10px 14px!important;min-height:44px;}' +
        '#search-error{font-size:12px;}' +
      '}';
    document.head.appendChild(s);
  }
});
