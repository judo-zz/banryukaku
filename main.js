/**
 * 蟠龍閣 ARG — メインスクリプト
 * 機能：
 * 1. レベルシステム管理（Lv0〜5）
 * 2. ナビゲーション制御
 * 3. スクロールエフェクト
 * 4. グリッチ演出のトリガー
 */

'use strict';

/* ================================================================
   LEVEL SYSTEM
   LocalStorageでレベルを永続管理
   ================================================================ */

const LEVEL_KEY = 'banryu_level';

function getLevel() {
  return parseInt(localStorage.getItem(LEVEL_KEY) || '0', 10);
}

function setLevel(lv) {
  const clamped = Math.max(0, Math.min(5, lv));
  localStorage.setItem(LEVEL_KEY, String(clamped));
  applyLevel(clamped);
}

function applyLevel(lv) {
  const body = document.body;
  // 既存のlvクラスをすべて削除
  for (let i = 0; i <= 5; i++) {
    body.classList.remove(`lv${i}`);
  }
  if (lv > 0) {
    body.classList.add(`lv${lv}`);
  }
}

// ページ読み込み時にレベルを復元
(function initLevel() {
  const lv = getLevel();
  applyLevel(lv);
})();

/* ================================================================
   ナビゲーション
   ================================================================ */

(function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  const nav    = document.getElementById('nav');

  if (!toggle || !menu || !nav) return;

  // ハンバーガーメニュー開閉
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // メニュー外クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // スクロールでNavの見た目を変える
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ================================================================
   スクロールアニメーション（Intersection Observer）
   ================================================================ */

(function initScrollReveal() {
  const targets = document.querySelectorAll('.pillar, .cast-card, .yume-post, .reserve-form, .concept__grid');

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ================================================================
   ARGイベント検出：レベルアップトリガー
   ================================================================ */

(function initARGTriggers() {

  // ゆめのブログページを訪問 → Lv1に
  if (window.location.pathname.includes('/yume/')) {
    const current = getLevel();
    if (current < 1) setLevel(1);
  }

  // 処分報告書ページを訪問 → Lv3に
  if (window.location.pathname.includes('/report/')) {
    const current = getLevel();
    if (current < 3) setLevel(3);
  }

  // 最終到達点 → Lv5に
  if (window.location.pathname.includes('/final/')) {
    const current = getLevel();
    if (current < 5) setLevel(5);
  }

  // フォームの紹介コードに特定の値を入力 → Lv2に
  const codeInput = document.getElementById('code');
  if (codeInput) {
    codeInput.addEventListener('change', () => {
      if (codeInput.value.toUpperCase() === 'BANRYU-0001') {
        const current = getLevel();
        if (current < 2) setLevel(2);
        // 隠しメッセージをコンソールに
        console.log('%c正しいコードです。蟠龍閣があなたを認めました。', 'color: #D4AF37; font-size: 14px;');
        console.log('%c次は /yume/ を見てください。', 'color: #C9A84C;');
      }
    });
  }

})();

/* ================================================================
   ARGコード生成（最終ページ用）
   ================================================================ */

(function initFinalCode() {
  const codeEl = document.getElementById('userCode');
  if (!codeEl) return;

  // セッションごとにユニークな（でも実は法則のある）コードを生成
  const seed = Date.now().toString(36).toUpperCase().slice(-4);
  const code = `BANRYU-${seed}`;
  codeEl.textContent = code;

  // コンソールにも表示
  console.log(`%cあなたのコード: ${code}`, 'color: #D4AF37; font-size: 16px; font-weight: bold;');
})();

/* ================================================================
   コンソールメッセージ（全ページ共通）
   デベロッパーツールを開いた人へのヒント
   ================================================================ */

(function initConsoleMessage() {
  const style = {
    title:  'color: #D4AF37; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(212,175,55,0.5);',
    body:   'color: #C9A84C; font-size: 12px;',
    hint:   'color: #8B6914; font-size: 11px;',
    code:   'color: #00DD44; font-family: monospace; font-size: 12px;',
  };

  console.log('%c蟠龍閣 // BANRYU SYSTEM', style.title);
  console.log('%cコードを読む者よ、龍はあなたを見ている。', style.body);
  console.log(' ');
  console.log('%c現在レベル: ' + getLevel(), style.hint);
  console.log('%cHINT: このサイトのフッターに、最初の鍵が隠されている。', style.hint);
  console.log(' ');
})();
