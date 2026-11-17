/* Тема: тёмная / светлая. По умолчанию — как в браузере, выбор запоминается */
(function () {
  var root = document.documentElement, KEY = 'nersola-theme';
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(t) {
    root.dataset.theme = t;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === 'dark' ? '#141416' : '#ecece9';
  }
  apply(saved() || (mq.matches ? 'dark' : 'light'));
  mq.addEventListener('change', function (e) { if (!saved()) apply(e.matches ? 'dark' : 'light'); });
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch (e) {}
    if (document.startViewTransition) document.startViewTransition(function () { apply(next); });
    else apply(next);
  });
})();
