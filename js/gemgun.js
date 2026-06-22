/**
 * Adesewa — TikTok Gemgun Effect 💎
 * Randomly fires gem bubbles around the page — burst shots + ambient floaters.
 */

(function () {
  /* ── Gem types with weights ─────────────────────────────────────────── */
  const GEMS = [
    { emoji: '💎', weight: 5 },
    { emoji: '💜', weight: 4 },
    { emoji: '✨', weight: 6 },
    { emoji: '🔮', weight: 3 },
    { emoji: '💫', weight: 5 },
    { emoji: '⭐', weight: 4 },
    { emoji: '🌟', weight: 3 },
    { emoji: '💗', weight: 4 },
    { emoji: '👑', weight: 2 },
    { emoji: '🫧', weight: 5 },
  ];

  /* Build weighted pool */
  const GEM_POOL = GEMS.flatMap(g => Array(g.weight).fill(g.emoji));

  /* ── Inject styles ──────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .gg-bubble {
      position: fixed;
      pointer-events: none;
      user-select: none;
      z-index: 9999;
      font-size: 18px;
      line-height: 1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform, opacity;
      animation: gg-float linear forwards;
    }

    .gg-bubble.large  { font-size: 26px; }
    .gg-bubble.small  { font-size: 12px; }
    .gg-bubble.tiny   { font-size: 9px;  }

    /* Bubble glass shell */
    .gg-bubble::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: radial-gradient(
        circle at 35% 35%,
        rgba(245,183,49,0.22) 0%,
        rgba(180,120,255,0.12) 40%,
        transparent 70%
      );
      border: 1px solid rgba(245,183,49,0.18);
      box-shadow:
        inset 0 0 8px rgba(245,183,49,0.12),
        0 2px 14px rgba(180,120,255,0.15);
    }

    @keyframes gg-float {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      8%   { opacity: 1;   transform: translate(var(--tx8), var(--ty8)) scale(1) rotate(var(--rot8)); }
      92%  { opacity: 0.9; transform: translate(var(--tx92), var(--ty92)) scale(var(--sc92)) rotate(var(--rot92)); }
      100% { opacity: 0;   transform: translate(var(--txF), var(--tyF)) scale(var(--scF)) rotate(var(--rotF)); }
    }

    @keyframes gg-burst {
      0%   { opacity: 0;   transform: translate(0,0) scale(0.2); }
      12%  { opacity: 1;   transform: translate(var(--bx12), var(--by12)) scale(1.2); }
      80%  { opacity: 0.7; transform: translate(var(--bx80), var(--by80)) scale(0.9); }
      100% { opacity: 0;   transform: translate(var(--bxF),  var(--byF))  scale(0.3); }
    }
  `;
  document.head.appendChild(style);

  /* ── Helpers ────────────────────────────────────────────────────────── */
  const rand   = (min, max) => Math.random() * (max - min) + min;
  const randInt= (min, max) => Math.floor(rand(min, max));
  const pick   = arr => arr[randInt(0, arr.length)];
  const px     = n => `${n}px`;
  const pct    = n => `${n}%`;

  function randomGem () { return pick(GEM_POOL); }

  /* ── Create a single floater ────────────────────────────────────────── */
  function spawnFloater () {
    const el = document.createElement('span');
    el.className = 'gg-bubble';
    el.textContent = randomGem();

    /* Size class */
    const sizeRoll = Math.random();
    if      (sizeRoll < 0.12) el.classList.add('large');
    else if (sizeRoll < 0.45) el.classList.add('small');
    else if (sizeRoll < 0.62) el.classList.add('tiny');

    /* Start position — random along bottom 80% of viewport edges */
    const edge = randInt(0, 4); // 0=bottom, 1=left, 2=right, 3=random-bottom
    let startX, startY;
    if (edge === 0 || edge === 3) {
      startX = rand(5, 95);   // % across bottom
      startY = rand(75, 102); // % below mid
    } else if (edge === 1) {
      startX = rand(-3, 8);
      startY = rand(20, 90);
    } else {
      startX = rand(92, 105);
      startY = rand(20, 90);
    }

    el.style.left = pct(startX);
    el.style.top  = pct(startY);

    /* Travel direction — mostly upward with horizontal drift */
    const driftX  = rand(-220, 220);
    const driftY  = rand(-420, -120);
    const dur     = rand(2.8, 6.5);
    const delay   = rand(0, 0.4);
    const rot     = rand(-360, 360);

    el.style.setProperty('--tx8',   px(driftX * 0.08));
    el.style.setProperty('--ty8',   px(driftY * 0.08));
    el.style.setProperty('--rot8',  `${rot * 0.08}deg`);
    el.style.setProperty('--tx92',  px(driftX * 0.92));
    el.style.setProperty('--ty92',  px(driftY * 0.92));
    el.style.setProperty('--sc92',  `${rand(0.7, 1.1)}`);
    el.style.setProperty('--rot92', `${rot * 0.92}deg`);
    el.style.setProperty('--txF',   px(driftX));
    el.style.setProperty('--tyF',   px(driftY));
    el.style.setProperty('--scF',   `${rand(0.2, 0.6)}`);
    el.style.setProperty('--rotF',  `${rot}deg`);
    el.style.animationName     = 'gg-float';
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay    = `${delay}s`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + 0.2) * 1000);
  }

  /* ── Burst: fire several gems from one spot ─────────────────────────── */
  function spawnBurst () {
    const count  = randInt(5, 14);
    const cx     = rand(10, 90);   // % X centre of burst
    const cy     = rand(40, 95);   // % Y centre of burst

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'gg-bubble';
      el.textContent = randomGem();

      const sizeRoll = Math.random();
      if      (sizeRoll < 0.15) el.classList.add('large');
      else if (sizeRoll < 0.5)  el.classList.add('small');

      el.style.left = pct(cx);
      el.style.top  = pct(cy);

      const angle  = rand(0, 360);
      const dist   = rand(80, 320);
      const bx     = Math.cos(angle * Math.PI / 180) * dist;
      const by     = Math.sin(angle * Math.PI / 180) * dist - rand(60, 200);
      const dur    = rand(1.4, 3.2);
      const delay  = rand(0, 0.3);

      el.style.setProperty('--bx12', px(bx * 0.15));
      el.style.setProperty('--by12', px(by * 0.15));
      el.style.setProperty('--bx80', px(bx * 0.82));
      el.style.setProperty('--by80', px(by * 0.82));
      el.style.setProperty('--bxF',  px(bx));
      el.style.setProperty('--byF',  px(by));
      el.style.animationName     = 'gg-burst';
      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay    = `${delay}s`;

      document.body.appendChild(el);
      setTimeout(() => el.remove(), (dur + delay + 0.2) * 1000);
    }
  }

  /* ── Scheduling ─────────────────────────────────────────────────────── */
  function scheduleFloater () {
    spawnFloater();
    setTimeout(scheduleFloater, rand(300, 900));
  }

  function scheduleBurst () {
    spawnBurst();
    setTimeout(scheduleBurst, rand(3500, 8000));
  }

  /* ── Start after page is interactive ───────────────────────────────── */
  function init () {
    /* Stagger the first few floaters so they don't all appear at once */
    for (let i = 0; i < 4; i++) {
      setTimeout(spawnFloater, i * 220);
    }
    setTimeout(scheduleFloater, 900);
    setTimeout(scheduleBurst,   2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
