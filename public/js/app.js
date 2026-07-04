const state = {
  name: "",
  position: "",
  listing: null,
  history: [],
  rejections: 0,
};

const phases = document.querySelectorAll(".phase");
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function showPhase(id) {
  phases.forEach((p) => p.classList.toggle("active", p.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderJobList() {
  const list = document.getElementById("job-list");
  list.innerHTML = "";
  LISTINGS.forEach((job, i) => {
    const row = document.createElement("div");
    row.className = "job-row";
    row.style.animationDelay = `${i * 60}ms`;
    row.innerHTML = `
      <div class="company-logo">${job.emoji}</div>
      <div class="job-info">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-meta">${job.meta}</div>
        ${job.easy ? '<div class="easy-apply">⚡ Kolay Başvuru (Kolay Red)</div>' : ""}
      </div>
      <div class="job-badge">${job.badge}</div>`;
    row.addEventListener("click", () => openDetail(job));
    list.appendChild(row);
  });
}

function openDetail(job) {
  state.listing = job;
  document.getElementById("detail-emoji").textContent = job.emoji;
  document.getElementById("detail-title").textContent = job.title;
  document.getElementById("detail-company").textContent = job.company;
  document.getElementById("detail-meta").textContent = job.meta;
  document.getElementById("detail-badge").textContent = job.badge;
  const reqs = document.getElementById("detail-requirements");
  const perks = document.getElementById("detail-perks");
  reqs.innerHTML = "";
  perks.innerHTML = "";
  for (const r of job.requirements) reqs.insertAdjacentHTML("beforeend", `<li>${r}</li>`);
  for (const p of job.perks) perks.insertAdjacentHTML("beforeend", `<li>${p}</li>`);
  showPhase("phase-detail");
}

const TICKER_NAMES = ["Mehmet K.", "Ayşe T.", "Emre D.", "Zeynep A.", "Burak S.", "Elif Y.", "Can Ö.", "Selin M.", "Oğuz H.", "Merve B."];
const TICKER_REASONS = [
  "fazla gülümsediği için reddedildi",
  "az gülümsediği için reddedildi",
  "maaş sorunca reddedildi",
  "CV'sinde Comic Sans kullandığı için reddedildi",
  "referans olarak annesini yazdığı için reddedildi",
  "mülakata tam vaktinde geldiği için reddedildi (fazla planlı)",
  "'ben takım oyuncusuyum' derken göz teması kurduğu için reddedildi",
  "5 yıl sonra kendini müdür olarak gördüğü için reddedildi",
  "hobisi 'kitap okumak' olduğu için reddedildi (yaratıcılık eksikliği)",
  "el sıkışı fazla kendinden emin bulunduğu için reddedildi",
];

function pushTicker() {
  const ticker = document.getElementById("ticker");
  const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
  const reason = TICKER_REASONS[Math.floor(Math.random() * TICKER_REASONS.length)];
  const item = document.createElement("div");
  item.className = "ticker-item";
  item.innerHTML = `<strong>${name}</strong> ${reason}<time>az önce</time>`;
  ticker.prepend(item);
  while (ticker.children.length > 5) ticker.lastChild.remove();
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

function dropConfetti() {
  const emojis = ["❌", "📄", "😢", "🚫", "📉"];
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2.2 + Math.random() * 2.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

function finishInterview(letter) {
  state.rejections += 1;
  document.getElementById("stat-rejections").textContent = state.rejections;
  setTimeout(() => {
    document.getElementById("rejection-text").textContent = letter;
    renderCertificate(state.name, state.position, letter, state.listing?.company);
    const card = document.querySelector(".rejection");
    card.classList.remove("slam", "shake");
    showPhase("phase-rejection");
    requestAnimationFrame(() => card.classList.add("slam", "shake"));
    dropConfetti();
  }, 800);
}

document.getElementById("btn-back").addEventListener("click", () => showPhase("phase-listings"));

document.getElementById("btn-apply").addEventListener("click", () => {
  document.getElementById("input-position").value = `${state.listing.title} — ${state.listing.company}`;
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
    `"${state.listing?.title}" pozisyonundan resmen reddedildim. 🎉 Sen de reddedilmek için: ${location.origin}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  state.history = [];
  chatLog.innerHTML = "";
  document.getElementById("apply-form").reset();
  showPhase("phase-listings");
});

renderJobList();
pushTicker();
pushTicker();
pushTicker();
setInterval(pushTicker, 6000);
