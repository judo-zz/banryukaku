'use strict';

// ================================================================
// 蟠龍閣 main.js
// 役割: ナビ・スクロールリビールのみ
// レベル管理・ARGトリガーは investigation.js + 各ページのインラインスクリプトで完結
// ================================================================

// ── ナビゲーション ─────────────────────────────────────────────
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  const nav    = document.getElementById('nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  document.addEventListener('click', (e) => {
    if (nav && !nav.contains(e.target)) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ── スクロールリビール (Intersection Observer) ─────────────────
(function initScrollReveal() {
  // .section に is-visible を付与 → CSS カスケードで子要素がアニメイン
  // 個別子要素を観測すると is-visible が親から外れて機能しないため .section のみ対象
  const targets = document.querySelectorAll('.section');
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
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();
