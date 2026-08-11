const therapyLog = document.getElementById("therapy-log");
const therapyForm = document.getElementById("therapy-form");
const therapyInput = document.getElementById("therapy-input");
const therapyWallBtn = document.getElementById("btn-therapy-wall");

const therapyState = { history: [], busy: false, lastVent: "" };

const THERAPY_OPENERS = [
  "Buyurun, dinliyorum. Bu görüşme kayıt altına alınmamaktadır. (Alınmaktadır.)",
  "Merhaba. Bugün sizi bir aday olarak değil, bir insan olarak dinleyeceğim. Süre 4 dakikadır.",
  "Hoş geldiniz. İçinizde ne varsa anlatın. Ardından işime geri döneceğim.",
  "Oturun lütfen. Bu kez size soru sormayacağım. Siz anlatın.",
];

const THERAPY_HINTS = [
  "Anlattığınız kadarıyla değerlendirebiliyorum.",
  "Devam edebilirsiniz. Zamanınız var. Benim yok.",
  "Bu konuyu açtığınız için teşekkür ederim. Kapatabiliriz.",
  "Sizi anlıyorum. Anlamak yükümlülük doğurmaz.",
];

function therapyMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role === "user" ? "user" : "hr"}`;
  div.textContent = text;
  therapyLog.appendChild(div);
  therapyLog.scrollTop = therapyLog.scrollHeight;
  return div;
}

function therapyTyping() {
  const div = document.createElement("div");
  div.className = "msg hr typing";
  div.innerHTML = "<span></span><span></span><span></span>";
  therapyLog.appendChild(div);
  therapyLog.scrollTop = therapyLog.scrollHeight;
  return div;
}

function setTherapyBusy(busy) {
  therapyState.busy = busy;
  therapyInput.disabled = busy;
  therapyForm.querySelector("button").disabled = busy;
  if (!busy) therapyInput.focus();
}

therapyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = therapyInput.value.trim();
  if (!text || therapyState.busy) return;
  therapyInput.value = "";
  therapyMessage("user", text);
  therapyState.history.push({ role: "user", text });
  therapyState.lastVent = text;
  therapyWallBtn.hidden = false;
  setTherapyBusy(true);

  const typing = therapyTyping();
  const started = performance.now();
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: therapyState.history, mode: "therapy" }),
    });
    const data = await res.json();
    await new Promise((r) => setTimeout(r, Math.max(0, 1600 - (performance.now() - started))));
    typing.remove();
    if (data.error) {
      therapyMessage("hr", data.error);
      setTherapyBusy(false);
      return;
    }
    therapyState.history.push({ role: "model", text: data.text });
    therapyMessage("hr", data.text);
    if (therapyState.history.length >= 6) {
      const note = document.createElement("div");
      note.className = "msg system";
      note.textContent = THERAPY_HINTS[Math.floor(Math.random() * THERAPY_HINTS.length)];
      therapyLog.appendChild(note);
      therapyLog.scrollTop = therapyLog.scrollHeight;
    }
  } catch {
    typing.remove();
    therapyMessage("hr", "Bağlantı koptu. Tam da açılmıştınız.");
  }
  setTherapyBusy(false);
});

therapyWallBtn.addEventListener("click", () => {
  openWall(therapyState.lastVent);
});

function openTherapy() {
  document.body.classList.remove("landing-open");
  if (location.pathname !== "/terapi") history.pushState({}, "", "/terapi");
  showPhase("phase-therapy");
  if (!therapyState.history.length && !therapyLog.children.length) {
    therapyMessage("hr", THERAPY_OPENERS[Math.floor(Math.random() * THERAPY_OPENERS.length)]);
  }
  therapyWallBtn.hidden = !therapyState.lastVent;
  setTimeout(() => therapyInput.focus(), 200);
}

document.getElementById("btn-open-therapy").addEventListener("click", openTherapy);

const EXTRA_ROUTES = {
  "/duvar": openWall,
  "/cark": openWheel,
  "/terapi": openTherapy,
};

for (const id of ["phase-wall", "phase-wheel", "phase-therapy"]) {
  document.querySelectorAll(`#${id} .btn-profile-back`).forEach((btn) =>
    btn.addEventListener("click", () => history.replaceState({}, "", "/"))
  );
}

window.addEventListener("popstate", () => {
  const route = EXTRA_ROUTES[location.pathname];
  if (route) return route();
  if (location.pathname === "/") showPhase("phase-listings");
});

function openExtraRoute() {
  const route = EXTRA_ROUTES[location.pathname];
  if (!route) return false;
  route();
  return true;
}

openExtraRoute();
