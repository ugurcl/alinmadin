const landing = document.getElementById("landing");

function fingerFallback() {
  const el = document.getElementById("hero-finger");
  const canvas = document.createElement("canvas").getContext("2d");
  canvas.font = "64px sans-serif";
  const viewer = canvas.measureText("\u{1FAF5}").width;
  const known = canvas.measureText("\u{1F449}").width;
  if (Math.abs(viewer - known) > 4) el.textContent = "\u{1F449}";
}

function enterSite() {
  sessionStorage.setItem("redin_landing", "1");
  document.body.classList.remove("landing-open");
  window.scrollTo({ top: 0 });
  showPhase("phase-listings");
  activateTab("feed");
}

function greetReturning() {
  if (!state.rejections) return;
  const first = (state.lastName || "").trim().split(/\s+/)[0];
  document.querySelector(".landing .eyebrow").textContent = first
    ? `Tekrar hoş geldin, ${first}`
    : "Tekrar hoş geldin";
  document.querySelector(".hero-line-1").textContent = "Yine mi iş arıyorsun?";
  document.querySelector(".hero-sub").textContent =
    `Son ziyaretinden bu yana ${state.rejections} kez reddedildin. Kayıtlarımız duruyor. Kararlılığını not ediyoruz.`;
  document.getElementById("btn-landing-start").textContent = "Yine reddedil";
}

if (location.pathname.startsWith("/r/") || sessionStorage.getItem("redin_landing")) {
  document.body.classList.remove("landing-open");
} else {
  fingerFallback();
  greetReturning();
}

document.getElementById("btn-landing-start").addEventListener("click", enterSite);
document.getElementById("btn-landing-start-2").addEventListener("click", enterSite);

document.getElementById("btn-landing-login").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = "Hesabınız yok";
  setTimeout(() => {
    btn.textContent = "Giriş Yap";
    btn.disabled = false;
  }, 2400);
});

document.querySelector(".landing .brand-logo").addEventListener("click", () => {
  landing.scrollIntoView({ behavior: "smooth" });
});
