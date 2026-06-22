/**
 * Adesewa — TikTok Stats
 * ─────────────────────────────────────────────────────────────
 * You can override these values directly inside any HTML page
 * by adding this block BEFORE the tiktok-stats.js script tag:
 *
 *   <script>
 *     window.ADESEWA_STATS = {
 *       followers:  '15.5K',
 *       likes:      '73.9K',
 *       streams:    '300+',
 *       battlesWon: '10+'
 *     };
 *   </script>
 *
 * Or just edit the defaults below to change them everywhere.
 * ─────────────────────────────────────────────────────────────
 */

const TIKTOK_STATS = Object.assign({
  followers:   '15.5K',
  likes:       '73.9K',
  streams:     '300+',
  battlesWon:  '10+',
  profileUrl:  'https://www.tiktok.com/@sewa_hairmpire',
}, window.ADESEWA_STATS || {});


// ─── Inject banner styles ─────────────────────────────────────────────────────
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .tiktok-live-banner {
      display: flex;
      justify-content: center;
      padding: 0.5rem 0 0.25rem;
    }
    .tiktok-live-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.45);
      font-size: 11px;
      font-family: var(--font-sans, 'Inter', sans-serif);
      letter-spacing: 0.1em;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .tiktok-live-link:hover { color: var(--gold, #f5b731); }
    .tiktok-live-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #ff4444;
      animation: pulse-dot 1.6s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.35; transform: scale(0.65); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Set a single element's text if it exists ─────────────────────────────────
function set(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

// ─── Populate all stat slots ──────────────────────────────────────────────────
function renderStats() {
  // ── Hero stats bar (index.html) ──
  const statNumbers = document.querySelectorAll('.stat-item .stat-number');
  const statLabels  = document.querySelectorAll('.stat-item .stat-label');
  if (statNumbers.length >= 3) {
    statNumbers[0].textContent = TIKTOK_STATS.followers;
    statNumbers[1].textContent = TIKTOK_STATS.likes;
    statNumbers[2].textContent = TIKTOK_STATS.streams;
    if (statLabels[0]) statLabels[0].textContent = 'Followers';
    if (statLabels[1]) statLabels[1].textContent = 'Total Likes';
    if (statLabels[2]) statLabels[2].textContent = 'Livestreams';
  }

  // ── About page stat boxes (about.html) ──
  set('about-followers', TIKTOK_STATS.followers);
  set('about-likes',     TIKTOK_STATS.likes);
  set('about-battles',   TIKTOK_STATS.battlesWon);
  set('about-streams',   TIKTOK_STATS.streams);
}

// ─── Point all TikTok buttons to the real profile ─────────────────────────────
function updateLinks() {
  const url = TIKTOK_STATS.profileUrl;
  ['social-tiktok', 'footer-tiktok', 'hero-cta-btn',
   'battles-cta-btn', 'about-cta-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = url;
  });
}

// ─── Pulsing @handle banner below hero stats ──────────────────────────────────
function addLiveBanner() {
  const statsBar = document.querySelector('.hero-stats-bar');
  if (!statsBar) return;

  const banner = document.createElement('div');
  banner.className = 'tiktok-live-banner';
  banner.innerHTML = `
    <a href="${TIKTOK_STATS.profileUrl}" target="_blank" rel="noopener noreferrer" class="tiktok-live-link">
      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88
          2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01
          a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34
          6.34 6.34 0 0 0 6.33-6.34V8.69a8.27 8.27 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/>
      </svg>
      <span>@sewa_hairmpire</span>
      <span class="tiktok-live-dot"></span>
    </a>
  `;
  statsBar.after(banner);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  renderStats();
  updateLinks();
  addLiveBanner();
});
