(function () {
  var KEY = "redin_soon_seen";
  var veil = document.getElementById("soon");
  var ok = document.getElementById("soon-ok");
  if (!veil || !ok) return;

  try {
    if (localStorage.getItem(KEY) === "1") return;
  } catch (e) {}

  function close() {
    veil.hidden = true;
    document.removeEventListener("keydown", onKey);
    try {
      localStorage.setItem(KEY, "1");
    } catch (e) {}
  }

  function onKey(event) {
    if (event.key === "Escape") close();
  }

  veil.hidden = false;
  ok.addEventListener("click", close);
  veil.addEventListener("click", function (event) {
    if (event.target === veil) close();
  });
  document.addEventListener("keydown", onKey);
  ok.focus();
})();
