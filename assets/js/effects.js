// ============================================================
// 蟠龍閣 ARG — effects.js
// 視覚・音響エフェクト
// ============================================================

// ── グリッチサウンド（Web Audio API、外部ファイル不要） ────
function brPlayGlitch() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* AudioContext not available */ }
}

// ── ターミナル・ビープ（隠しページ到達時） ─────────────────
function brPlayBeep(freq = 440, ms = 80) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000);
  } catch { }
}

// ── グリッチテキスト（文字化け → 正文字に収束） ─────────────
const _GLITCH_CHARS = '!@#$%&?/\\|_-=+*^<>[]{}0１２３４５６７８９文字化け龍牌会蟠龍';

function brGlitchText(el, targetText, durationMs = 800) {
  const frames = Math.round(durationMs / 50);
  let frame = 0;
  const id = setInterval(() => {
    frame++;
    const ratio = frame / frames;
    let result = '';
    for (let i = 0; i < targetText.length; i++) {
      if (Math.random() < ratio) {
        result += targetText[i];
      } else {
        result += _GLITCH_CHARS[Math.floor(Math.random() * _GLITCH_CHARS.length)];
      }
    }
    el.textContent = result;
    if (frame >= frames) {
      clearInterval(id);
      el.textContent = targetText;
    }
  }, 50);
}

// ── タイプライター（一文字ずつ表示） ───────────────────────
function brTypewriter(el, text, msPerChar = 60, onDone) {
  el.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      onDone && onDone();
    }
  }, msPerChar);
  return iv;
}

// ── スキャンライン走査（Lv3+で背景を走るライン） ───────────
function brStartScanline() {
  const el = document.createElement('div');
  el.className = 'br-scanline-sweep';
  document.body.appendChild(el);
}

// ── CRT グリッチフラッシュ ────────────────────────────────
function brCRTFlash(color = '#00ff9f', durationMs = 120) {
  const el = document.createElement('div');
  el.className = 'br-crt-flash';
  el.style.cssText = `
    position:fixed;inset:0;z-index:9997;pointer-events:none;
    background:${color};opacity:0.08;transition:opacity ${durationMs}ms ease;
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '0'; }));
  setTimeout(() => el.remove(), durationMs + 50);
}

// ── ページ全体を一瞬ゆらすシェイク ───────────────────────
function brPageShake(ms = 300) {
  document.documentElement.classList.add('br-shake-page');
  setTimeout(() => document.documentElement.classList.remove('br-shake-page'), ms);
}

// ── マトリックス雨（hack.html用, Canvas） ─────────────────
function brStartMatrixRain(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789龍牌会蟠弄怜ゆめ失敗次RENPAI';
  const fontSize = 14;
  let cols = Math.floor(canvas.width / fontSize);
  let drops = Array(cols).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 4, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff9f';
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  return setInterval(draw, 40);
}

// ── Level変化時の一括グリッチ演出 ─────────────────────────
window.addEventListener('br:level', ({ detail: { level } }) => {
  brCRTFlash(level >= 3 ? '#00ff9f' : '#ff2244');
  if (level >= 2) brPageShake();

  // Lv3+: .br-glitch クラスの要素をグリッチ
  if (level >= 3) {
    document.querySelectorAll('.br-glitch').forEach(el => {
      const orig = el.dataset.original || el.textContent;
      el.dataset.original = orig;
      brGlitchText(el, orig, 900);
    });
  }
});
