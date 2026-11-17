/* Выбор роли: Заказчик / Монтажёр */
(function () {
  var body = document.body;
  var panes = document.querySelectorAll('.pane');
  var tabs = document.querySelectorAll('.switch button');
  function setRole(r) {
    body.dataset.role = r;
    panes.forEach(function (p) { p.classList.toggle('on', p.dataset.pane === r); });
    tabs.forEach(function (b) { b.classList.toggle('on', b.dataset.setrole === r); });
  }
  document.querySelectorAll('[data-setrole]').forEach(function (b) {
    b.addEventListener('click', function () { setRole(b.dataset.setrole); });
  });
})();
