/* ============================================================
   PORTFOLIO V2 — theme.js
   Toggle de tema claro/oscuro. El data-theme inicial ya se
   setea en un script inline en el <head> (para evitar parpadeo);
   acá solo manejamos el click y el guardado de preferencia.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncButton() {
    const isLight = currentTheme() === 'light';
    btn.setAttribute('aria-pressed', String(isLight));
  }

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* Safari privado, etc */ }
    syncButton();
  });

  syncButton();
});
