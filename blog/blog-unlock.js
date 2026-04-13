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
        setTimeout(showAll, 600);
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
