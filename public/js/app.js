const state = {
  name: "",
  position: "",
  listing: null,
  history: [],
};

const phases = document.querySelectorAll(".phase");
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function showPhase(id) {
  phases.forEach((p) => p.classList.toggle("active", p.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderJobGrid() {
  const grid = document.getElementById("job-grid");
  grid.innerHTML = "";
  for (const job of LISTINGS) {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <span class="badge">${job.badge}</span>
      <h3>${job.title}</h3>
      <p class="muted small">${job.meta}</p>
      <button class="btn btn-primary btn-sm">İncele ve Reddedil</button>`;
    card.querySelector("button").addEventListener("click", () => openDetail(job));
    grid.appendChild(card);
  }
}

function openDetail(job) {
  state.listing = job;
  document.getElementById("detail-title").textContent = job.title;
  document.getElementById("detail-meta").textContent = `Vizyoner Global Teknoloji A.Ş. · ${job.meta}`;
  document.getElementById("detail-badge").textContent = job.badge;
  const reqs = document.getElementById("detail-requirements");
  const perks = document.getElementById("detail-perks");
  reqs.innerHTML = "";
  perks.innerHTML = "";
  for (const r of job.requirements) reqs.insertAdjacentHTML("beforeend", `<li>${r}</li>`);
  for (const p of job.perks) perks.insertAdjacentHTML("beforeend", `<li>${p}</li>`);
  showPhase("phase-detail");
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role === "user" ? "user" : "hr"}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "msg hr typing";
  div.innerHTML = "Buket yazıyor<span class='dots'><i>.</i><i>.</i><i>.</i></span>";
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function setBusy(busy) {
  chatInput.disabled = busy;
  chatForm.querySelector("button").disabled = busy;
  if (!busy) chatInput.focus();
}

async function sendToHr() {
  setBusy(true);
  const typing = addTyping();
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: state.history, name: state.name }),
    });
    const data = await res.json();
    typing.remove();
    if (data.error) {
      addMessage("hr", data.error);
      setBusy(false);
      return;
    }
    if (data.type === "rejection") {
      finishInterview(data.text);
      return;
    }
    state.history.push({ role: "model", text: data.text });
    addMessage("hr", data.text);
    setBusy(false);
  } catch {
    typing.remove();
    addMessage("hr", "Bağlantı koptu. Bunu da olumsuz değerlendireceğiz.");
    setBusy(false);
  }
}

function finishInterview(letter) {
  setTimeout(() => {
    document.getElementById("rejection-text").textContent = letter;
    renderCertificate(state.name, state.position, letter);
    showPhase("phase-rejection");
  }, 800);
}

document.getElementById("btn-back").addEventListener("click", () => showPhase("phase-listings"));

document.getElementById("btn-apply").addEventListener("click", () => {
  document.getElementById("input-position").value = state.listing.title;
  showPhase("phase-form");
  document.getElementById("input-name").focus();
});

document.getElementById("apply-form").addEventListener("submit", (e) => {
  e.preventDefault();
  state.name = document.getElementById("input-name").value.trim();
  state.position = document.getElementById("input-position").value.trim();
  const salary = document.getElementById("input-salary").value;
  const why = document.getElementById("input-why").value.trim();
  state.history = [
    {
      role: "user",
      text: `Başvuru bilgileri — İsim: ${state.name}. Pozisyon: ${state.position}. Maaş beklentisi: ${salary}. Neden bizimle çalışmak istiyor: ${why}`,
    },
  ];
  chatLog.innerHTML = "";
  showPhase("phase-interview");
  sendToHr();
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || chatInput.disabled) return;
  chatInput.value = "";
  state.history.push({ role: "user", text });
  addMessage("user", text);
  sendToHr();
});

document.getElementById("btn-download").addEventListener("click", downloadCertificate);

document.getElementById("btn-tweet").addEventListener("click", () => {
  const text = encodeURIComponent(
    `"${state.position}" pozisyonundan resmen reddedildim. 🎉 Sen de reddedilmek için: ${location.origin}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  state.history = [];
  chatLog.innerHTML = "";
  document.getElementById("apply-form").reset();
  showPhase("phase-listings");
});

renderJobGrid();
