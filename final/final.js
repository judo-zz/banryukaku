/**
 * 最終到達点 — 演出スクリプト
 */

'use strict';

/* コードをフリップアニメーションで表示 */
(function initCodeReveal() {
  const codeEl = document.getElementById('userCode');
  if (!codeEl) return;

  const seed = Date.now().toString(36).toUpperCase().slice(-4);
  const finalCode = `BANRYU-${seed}`;

  // 最初はランダムな文字を表示し、徐々に正しい文字に収束させる
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let iteration = 0;
  const totalFrames = 20;

  const interval = setInterval(() => {
    codeEl.textContent = finalCode
      .split('')
      .map((char, idx) => {
        if (char === '-' || char === 'B' && idx === 0) return char;
        if (idx < iteration) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    iteration += 0.5;

    if (iteration >= finalCode.length) {
      clearInterval(interval);
      codeEl.textContent = finalCode;
    }
  }, 60);
})();
