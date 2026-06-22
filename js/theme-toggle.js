/* =============================================
   theme-toggle.js — shared across all pages
   Injects the floating toggle pill into the DOM
   and wires up click handlers + localStorage.
============================================= */
(function () {
  var THEMES = ['dark', 'light', 'neon'];
  var saved  = localStorage.getItem('ade-theme') || 'dark';
  if (!THEMES.includes(saved)) saved = 'dark';

  /* ----- Inject the pill HTML if not already in the page ----- */
  if (!document.getElementById('theme-toggle-global')) {
    var pill = document.createElement('div');
    pill.className  = 'theme-toggle theme-toggle-fixed';
    pill.id         = 'theme-toggle-global';
    pill.setAttribute('role', 'group');
    pill.setAttribute('aria-label', 'Select theme');
    pill.innerHTML  =
      '<button class="theme-btn" data-theme="dark"  title="Dark">🌙</button>' +
      '<button class="theme-btn" data-theme="light" title="Light">☀️</button>' +
      '<button class="theme-btn" data-theme="neon"  title="Neon">⚡</button>'  +
      '<div class="theme-slider"></div>';
    document.body.appendChild(pill);
  }

  /* ----- Apply theme to <html> and sync all toggles ----- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ade-theme', theme);

    document.querySelectorAll('.theme-toggle').forEach(function (tog) {
      tog.setAttribute('data-active', theme);
      tog.querySelectorAll('.theme-btn').forEach(function (btn) {
        var active = btn.getAttribute('data-theme') === theme;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    });
  }

  /* ----- Apply saved theme immediately ----- */
  applyTheme(saved);

  /* ----- Wire clicks on every .theme-btn on the page ----- */
  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-theme'));
    });
  });
})();
