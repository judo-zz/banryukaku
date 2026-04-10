/**
 * ハッキング画面 — マトリックスデータ雨 + インタラクティブCLI
 */

'use strict';

/* ================================================================
   マトリックスデータ雨（Canvas）
   ================================================================ */

(function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF蟠龍閣';
  const charArr = chars.split('');

  let columns, drops;
  const fontSize = 14;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops   = new Array(columns).fill(1);
  }

  function draw() {
    // 残像効果：半透明の黒で塗りつぶし
    ctx.fillStyle = 'rgba(0, 8, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 緑の文字
    ctx.fillStyle = '#00FF41';
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      // ランダムな文字
      const char = charArr[Math.floor(Math.random() * charArr.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // 先頭の文字は明るく
      if (drops[i] * fontSize < canvas.height * 0.05) {
        ctx.fillStyle = '#AAFFBB';
      } else {
        ctx.fillStyle = '#00FF41';
      }

      ctx.fillText(char, x, y);

      // 画面下に到達したら確率でリセット
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();

/* ================================================================
   時計表示
   ================================================================ */

(function initClock() {
  const el = document.getElementById('hackTime');
  if (!el) return;

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }

  update();
  setInterval(update, 1000);
})();

/* ================================================================
   インタラクティブCLI
   ================================================================ */

(function initCLI() {
  const log   = document.getElementById('hackLog');
  const input = document.getElementById('hackInput');
  if (!log || !input) return;

  let lineIndex = 0;

  // ログに1行追記する
  function addLine(text, type = 'output', delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const line = document.createElement('span');
        line.className = `log-line log-line--${type}`;
        line.textContent = text;
        line.style.animationDelay = '0ms';
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
        resolve();
      }, delay);
    });
  }

  function addBlank(delay = 0) {
    return addLine('', 'blank', delay);
  }

  // 自動ブートシーケンス
  async function bootSequence() {
    await addLine('BANRYU-CORE v4.1.0 起動中...', 'system', 0);
    await addLine('ネットワークインターフェース確認... [OK]', 'system', 300);
    await addLine('セキュリティモジュール確認... [OK]', 'system', 600);
    await addLine('ファイルシステムマウント... [OK]', 'system', 900);
    await addBlank(1200);
    await addLine('!! 警告: 認証されていないアクセスを検出しました !!', 'error', 1300);
    await addLine(`接続元 IP: ${generateFakeIP()}`, 'system', 1600);
    await addLine(`タイムスタンプ: ${new Date().toISOString()}`, 'system', 1800);
    await addBlank(2000);
    await addLine('蟠龍体系セキュリティプロトコルを実行します...', 'warn', 2200);
    await addLine('アクセスログを記録中...', 'warn', 2600);
    await addBlank(3000);
    await addLine('// あなたはここにいるべきではありません。', 'system', 3200);
    await addLine('// しかし、龍はあなたを止めません。', 'system', 3500);
    await addBlank(3800);
    await addLine("help と入力してコマンド一覧を確認してください。", 'output', 4000);
  }

  bootSequence();

  // ファイルシステムの定義
  const filesystem = {
    '/': ['yume/', 'report/', 'system/', 'README.txt'],
    '/yume/': ['diary.txt', 'last_entry.txt'],
    '/report/': ['BANRYU-REPORT-2024-1103.doc', 'PROC-REDACTED.doc'],
    '/system/': ['banryu_taikei.cfg', 'level_map.json'],
  };

  const fileContents = {
    'README.txt': [
      'BANRYU SYSTEM ファイルサーバー',
      '=================================',
      'このシステムへの不正アクセスは記録されています。',
      '正規の認証コードを持つ者のみがアクセスを許可されます。',
      '',
      '認証コード形式: BANRYU-XXXX',
      '',
      '-- 蟠龍閣 龍務局',
    ],
    'diary.txt': [
      'ゆめのメモ (2024.10.25)',
      '---',
      'ロッカールームの奥の扉のことが忘れられない。',
      '「B3F」という文字が見えた。',
      'あの紙には何が書いてあったのだろう。',
      '',
      '--- [このファイルはこれ以上読めません] ---',
    ],
    'last_entry.txt': [
      '[ERROR: ファイルが破損しています]',
      '[ERROR: 最終更新: 2024-11-03 03:17:44]',
      '',
      '███████████████████████████████',
      '地下に何かある。B3Fへ行っては',
      '███████████████████████████████',
      '',
      '誰かが読んでいるなら。/final/ へ。',
      'パスワード: BANRYU-0001',
    ],
    'banryu_taikei.cfg': [
      '# 蟠龍体系 設定ファイル',
      '# CLASSIFICATION: AA',
      '',
      'LEVEL_MAX=5',
      'SILENCE_THRESHOLD=1',
      'B3F_ACCESS=RESTRICTED',
      'CAST_MONITORING=TRUE',
      '',
      '# Lv5到達条件: /final/ にアクセスすること',
      '# FINAL_PATH=/final/',
    ],
    'level_map.json': [
      '{',
      '  "lv0": "表の顔。コンカフェ蟠龍閣。",',
      '  "lv1": "ゆめのブログを発見。 /yume/",',
      '  "lv2": "紹介コードの意味を知る。 BANRYU-0001",',
      '  "lv3": "処分報告書を読む。 /report/",',
      '  "lv4": "ハッキング画面へ到達。 /hack/",',
      '  "lv5": "龍の目覚め。 /final/"',
      '}',
    ],
  };

  let currentDir = '/';

  // コマンド処理
  const commands = {

    help() {
      return [
        { text: '利用可能なコマンド:', type: 'system' },
        { text: '  help          このメッセージを表示', type: 'output' },
        { text: '  ls [dir]      ファイル一覧', type: 'output' },
        { text: '  cat [file]    ファイル内容を表示', type: 'output' },
        { text: '  cd [dir]      ディレクトリ移動', type: 'output' },
        { text: '  pwd           現在のパスを表示', type: 'output' },
        { text: '  clear         画面をクリア', type: 'output' },
        { text: '  whoami        現在のユーザー', type: 'output' },
        { text: '  level         現在のARGレベルを表示', type: 'output' },
        { text: '  goto [path]   ページに移動', type: 'output' },
      ];
    },

    ls(args) {
      const dir = args[0] ? (args[0].startsWith('/') ? args[0] : currentDir + args[0]) : currentDir;
      const normalized = dir.endsWith('/') ? dir : dir + '/';
      const files = filesystem[normalized] || filesystem[currentDir];
      if (!files) return [{ text: `ls: ${dir}: そのようなディレクトリはありません`, type: 'error' }];
      return files.map((f) => ({
        text: f.endsWith('/') ? `drwxr-xr-x  ${f}` : `-rw-r--r--  ${f}`,
        type: f.endsWith('/') ? 'warn' : 'output',
      }));
    },

    cat(args) {
      if (!args[0]) return [{ text: 'cat: ファイル名を指定してください', type: 'error' }];
      const content = fileContents[args[0]];
      if (!content) return [{ text: `cat: ${args[0]}: ファイルが見つかりません`, type: 'error' }];
      return content.map((line) => ({ text: line, type: 'output' }));
    },

    cd(args) {
      if (!args[0]) {
        currentDir = '/';
        return [{ text: 'ホームディレクトリに移動しました。', type: 'system' }];
      }
      const target = args[0].endsWith('/') ? args[0] : args[0] + '/';
      if (filesystem[target]) {
        currentDir = target;
        return [{ text: `${target} に移動しました。`, type: 'system' }];
      }
      return [{ text: `cd: ${args[0]}: そのようなディレクトリはありません`, type: 'error' }];
    },

    pwd() {
      return [{ text: currentDir, type: 'output' }];
    },

    whoami() {
      return [
        { text: '不明なアクセス者', type: 'error' },
        { text: '// 龍はあなたを見ています。', type: 'warn' },
      ];
    },

    level() {
      const lv = parseInt(localStorage.getItem('banryu_level') || '0', 10);
      return [
        { text: `現在のレベル: ${lv}`, type: 'output' },
        { text: lv >= 4 ? '// あと一歩です。/final/ へ。' : '// まだ調べるべき場所があります。', type: 'secret' },
      ];
    },

    goto(args) {
      // hack/ サブディレクトリからの相対パス
      const paths = {
        'top':    '../',
        'yume':   '../yume/',
        'report': '../report/',
        'final':  '../final/',
        'cast':   '../cast.html',
      };
      const target = args[0] && paths[args[0]];
      if (!target) return [{ text: `goto: 不明なパス。使用可能: ${Object.keys(paths).join(', ')}`, type: 'error' }];
      window.location.href = target;
      return [{ text: `移動中: ${target}`, type: 'system' }];
    },

    clear() {
      log.innerHTML = '';
      return [];
    },
  };

  function generateFakeIP() {
    return `${randInt(100, 200)}.${randInt(10, 99)}.${randInt(10, 99)}.${randInt(10, 99)}`;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function runCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = parts.slice(1);

    // 入力をログに表示
    await addLine(`root@BANRYU-CORE:~$ ${raw}`, 'system');

    // ── パスワード判定（RENPAI） ─────────────────────────────
    // brInitPasswordGate と同じ判定ロジック
    try {
      if (btoa(raw.trim().toUpperCase()) === 'UkVOUEFJ') {
        await addLine('// 認証コードを照合中...', 'warn', 400);
        await addLine('// ........', 'warn', 900);
        await addLine('// MATCH: Level 4 clearance confirmed.', 'warn', 1400);
        await addLine('// アクセスを許可します。リダイレクトします...', 'system', 2200);
        if (typeof brTryLevel === 'function') brTryLevel(4);
        setTimeout(() => { window.location.href = '../final/'; }, 3600);
        return;
      }
    } catch { /* btoa error */ }

    const handler = commands[cmd];
    if (!handler) {
      await addLine(`コマンドが見つかりません: ${cmd}`, 'error');
      await addLine('// help でコマンド一覧を確認してください。', 'output');
      return;
    }

    const lines = handler(args);
    for (const line of lines) {
      await addLine(line.text, line.type, 30);
    }
    await addBlank();
  }

  // Enterキーでコマンド実行
  input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    await runCommand(value);
  });

  // ページ読み込み時にLv4に
  const current = parseInt(localStorage.getItem('banryu_level') || '0', 10);
  if (current < 4) {
    localStorage.setItem('banryu_level', '4');
    document.body.classList.remove('lv0', 'lv1', 'lv2', 'lv3', 'lv4', 'lv5');
    document.body.classList.add('lv4');
  }
})();
