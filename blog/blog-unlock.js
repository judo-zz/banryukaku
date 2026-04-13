// blog-unlock.js — password unlock for Yume-related blog entries
(function () {
  var PASS = 'LEMON';
  var FLAG = 'blog_pass_unlocked';

  function showAll() {
    // クラス除去 + インラインstyle両方かけて確実に表示
    var els = document.querySelectorAll('.blog-locked');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove('blog-locked');
      els[i].style.display = 'block';
    }
    var widget = document.getElementById('blog-pass-widget');
    if (widget) widget.style.display = 'none';

    // ゆめのブログリンクに金色glow
    var links = document.querySelectorAll('a[href="yume.html"]');
    for (var j = 0; j < links.length; j++) {
      links[j].style.textShadow = '0 0 8px rgba(255,204,68,0.7)';
      links[j].style.color = '#ffcc44';
    }

    // ARGフラグ連動
    if (typeof ARG !== 'undefined' && ARG.addFlag) {
      ARG.addFlag('blog_unlocked');
    }
  }

  function showAllWithEffect() {
    // オーバーレイ生成
    var overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'width:100vw', 'height:100vh',
      'background:rgba(0,0,0,0.88)', 'z-index:9999',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'transition:opacity 0.5s ease',
    ].join(';');

    var text1 = document.createElement('div');
    text1.style.cssText = 'font-family:monospace;font-size:22px;color:#ffcc44;letter-spacing:0.2em;margin-bottom:12px;';
    text1.textContent = 'UNLOCKED';

    var text2 = document.createElement('div');
    text2.style.cssText = 'font-family:monospace;font-size:13px;color:#c8b89a;letter-spacing:0.1em;';
    text2.textContent = 'ロック解除 — 新着記事を検出';

    overlay.appendChild(text1);
    overlay.appendChild(text2);
    document.body.appendChild(overlay);

    // 800ms後にフェードアウト
    setTimeout(function () {
      overlay.style.opacity = '0';
      overlay.addEventListener('transitionend', function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        // 鍵記事をフェードインで出現
        showAll();
        var newEls = document.querySelectorAll('[style*="display: block"]');
        for (var i = 0; i < newEls.length; i++) {
          newEls[i].style.opacity = '0';
          newEls[i].style.transition = 'opacity 0.6s ease';
          (function(el) {
            setTimeout(function() { el.style.opacity = '1'; }, 50);
          })(newEls[i]);
        }
      }, { once: true });
    }, 800);
  }

  function tryUnlock() {
    var btn   = document.getElementById('blog-pass-btn');
    var input = document.getElementById('blog-pass-input');
    var msg   = document.getElementById('blog-pass-msg');
    if (!btn || !input) return;

    function attempt() {
      var val = input.value.replace(/\s/g, '').toUpperCase();
      if (val === PASS) {
        localStorage.setItem(FLAG, '1');
        if (msg) { msg.textContent = 'UNLOCKED'; msg.style.color = 'rgba(100,220,130,0.9)'; }
        setTimeout(showAllWithEffect, 600);
      } else {
        if (msg) { msg.textContent = 'ERROR'; msg.style.color = 'rgba(255,100,100,0.9)'; }
        input.value = '';
        setTimeout(function () { if (msg) msg.textContent = ''; }, 1500);
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
  }

  function init() {
    if (localStorage.getItem(FLAG)) {
      showAll();
    } else {
      tryUnlock();
    }
  }

  // DOMが確実に読み込まれてから実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
