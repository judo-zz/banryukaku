// blog-unlock.js — password unlock for Yume-related blog entries
(function () {
  const PASS = 'RENPAI';
  const FLAG = 'blog_pass_unlocked';

  function showAll() {
    document.querySelectorAll('.blog-locked').forEach(function (el) {
      el.classList.remove('blog-locked');
    });
    var widget = document.getElementById('blog-pass-widget');
    if (widget) widget.style.display = 'none';
  }

  function init() {
    if (localStorage.getItem(FLAG)) {
      showAll();
      return;
    }

    var btn   = document.getElementById('blog-pass-btn');
    var input = document.getElementById('blog-pass-input');
    var msg   = document.getElementById('blog-pass-msg');

    if (!btn || !input) return;

    function attempt() {
      if (input.value.trim().toUpperCase() === PASS) {
        localStorage.setItem(FLAG, '1');
        if (msg) { msg.textContent = 'UNLOCKED'; msg.style.color = 'rgba(100,220,130,0.8)'; }
        setTimeout(showAll, 700);
      } else {
        if (msg) { msg.textContent = 'ERROR'; msg.style.color = 'rgba(255,100,100,0.8)'; }
        input.value = '';
        setTimeout(function () { if (msg) msg.textContent = ''; }, 1500);
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
