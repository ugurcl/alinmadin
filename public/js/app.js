const state = {
  name: "",
  position: "",
  listing: null,
  history: [],
  rejections: Number(localStorage.getItem("redin_rejections") || 0),
};

const BADGES = [
  { at: 1, name: "İlk Red", desc: "Herkes bir yerden başlar" },
  { at: 3, name: "Azimli", desc: "Üç red, sıfır ders" },
  { at: 5, name: "Umut Fakiri", desc: "Beş kez denedi, beş kez emin olduk" },
  { at: 10, name: "Havuz Sakini", desc: "CV'niz artık demirbaş" },
  { at: 25, name: "Buket Sizi İsminizle Tanıyor", desc: "Bu bir iltifat değil" },
];

function earnedBadges(count) {
  return BADGES.filter((b) => count >= b.at);
}

function renderBadges() {
  const list = document.getElementById("badge-list");
  const earned = earnedBadges(state.rejections);
  if (!earned.length) {
    list.innerHTML = "";
    return;
  }
  list.innerHTML =
    `<hr><p class="badge-list-title">Başarımların</p>` +
    earned.map((b) => `<span class="badge-pill" title="${b.desc}">${b.name}</span>`).join("");
}

const phases = document.querySelectorAll(".phase");
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function showPhase(id) {
  phases.forEach((p) => p.classList.toggle("active", p.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const LOGO_COLORS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f5576c, #b91d3a)",
  "linear-gradient(135deg, #4facfe, #00c6a7)",
  "linear-gradient(135deg, #fa709a, #f7b733)",
  "linear-gradient(135deg, #30cfd0, #330867)",
  "linear-gradient(135deg, #2af598, #009efd)",
  "linear-gradient(135deg, #f2994a, #b34700)",
  "linear-gradient(135deg, #8e2de2, #4a00e0)",
  "linear-gradient(135deg, #11998e, #38ef7d)",
  "linear-gradient(135deg, #536976, #292e49)",
];

function logoColor(job) {
  return LOGO_COLORS[LISTINGS.indexOf(job) % LOGO_COLORS.length];
}

function buildJobRow(job, i) {
  const row = document.createElement("div");
  row.className = "job-row";
  row.style.animationDelay = `${i * 60}ms`;
  row.innerHTML = `
    <div class="company-logo" style="background:${logoColor(job)}">${job.abbr}</div>
    <div class="job-info">
      <div class="job-title">${job.title}</div>
      <div class="job-company">${job.company}</div>
      <div class="job-meta">${job.meta}</div>
      ${job.easy ? '<div class="easy-apply">Kolay Başvuru (Kolay Red)</div>' : ""}
    </div>
    <div class="job-badge">${job.badge}</div>`;
  row.addEventListener("click", () => openDetail(job));
  return row;
}

function buildPostCard(post, index) {
  const card = document.createElement("div");
  card.className = "card post-card";
  const color = LOGO_COLORS[index % LOGO_COLORS.length];
  card.innerHTML = `
    <div class="post-head">
      <div class="post-avatar" style="background:${color}">${post.initials}</div>
      <div class="post-author">
        <strong>${post.author}</strong><span class="post-follow"> · Takip Et</span>
        <p class="muted small">${post.title}</p>
        <p class="muted post-time">${post.time}</p>
      </div>
    </div>
    <p class="post-text">${post.text}</p>
    <div class="post-stats">
      <span class="like-count">${post.likes} beğeni</span> · ${post.comments}
    </div>
    <div class="post-actions">
      <span class="post-action act-like">
        <svg class="icon" viewBox="0 0 24 24"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
        Beğen
      </span>
      <span class="post-action">
        <svg class="icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Yorum Yap
      </span>
      <span class="post-action">
        <svg class="icon" viewBox="0 0 24 24"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
        Paylaş
      </span>
    </div>`;
  const likeBtn = card.querySelector(".act-like");
  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("liked")) return;
    likeBtn.classList.add("liked");
    likeBtn.lastChild.textContent = " Beğendin (geri alamazsın)";
  });
  return card;
}

function renderFeed(tab) {
  const stream = document.getElementById("feed-stream");
  const subtitle = document.getElementById("feed-subtitle");
  stream.innerHTML = "";
  if (tab === "jobs") {
    subtitle.textContent = "Profiline göre uygun olmadığın pozisyonları listeledik";
    const listCard = document.createElement("div");
    listCard.className = "card job-list";
    LISTINGS.forEach((job, i) => listCard.appendChild(buildJobRow(job, i)));
    stream.appendChild(listCard);
    return;
  }
  subtitle.textContent = "Ağındaki profesyonellerden ilham verici paylaşımlar";
  POSTS.forEach((post, i) => stream.appendChild(buildPostCard(post, i)));
}

function activateTab(tab) {
  document.getElementById("tab-feed").classList.toggle("active", tab === "feed");
  document.getElementById("tab-jobs").classList.toggle("active", tab === "jobs");
  document.getElementById("nav-home").classList.toggle("active", tab === "feed");
  document.getElementById("nav-jobs").classList.toggle("active", tab === "jobs");
  renderFeed(tab);
}

document.getElementById("tab-feed").addEventListener("click", () => activateTab("feed"));
document.getElementById("tab-jobs").addEventListener("click", () => activateTab("jobs"));

document.getElementById("nav-home").addEventListener("click", () => {
  showPhase("phase-listings");
  activateTab("feed");
});

document.getElementById("nav-jobs").addEventListener("click", () => {
  showPhase("phase-listings");
  activateTab("jobs");
});

function openDetail(job) {
  state.listing = job;
  const logo = document.getElementById("detail-emoji");
  logo.textContent = job.abbr;
  logo.style.background = logoColor(job);
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
  const initials = name.split(" ").map((p) => p[0]).join("");
  const color = LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
  const item = document.createElement("div");
  item.className = "ticker-item";
  item.innerHTML = `
    <div class="ticker-avatar" style="background:${color}">${initials}</div>
    <div><strong>${name}</strong> ${reason}<time>az önce</time></div>`;
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
  const colors = ["#d0342c", "#e8927c", "#8a9096", "#c9a227", "#5d7a9c"];
  for (let i = 0; i < 32; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2.2 + Math.random() * 2.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

function finishInterview(letter) {
  const before = earnedBadges(state.rejections).length;
  state.rejections += 1;
  localStorage.setItem("redin_rejections", state.rejections);
  document.getElementById("stat-rejections").textContent = state.rejections;
  renderBadges();
  const fresh = earnedBadges(state.rejections).slice(before);
  const banner = document.getElementById("badge-earned");
  banner.innerHTML = fresh
    .map(
      (b) => `<div class="badge-banner">Yeni başarım kazandınız: <strong>${b.name}</strong> — ${b.desc}</div>`
    )
    .join("");
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
  showPhase("phase-queue");
  runQueue(() => {
    showPhase("phase-interview");
    sendToHr();
  });
});

function runQueue(done) {
  const numberEl = document.getElementById("queue-number");
  const statusEl = document.getElementById("queue-status");
  const fillEl = document.getElementById("queue-fill");

  function countdown(from, duration, onEnd) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.max(1, Math.round(from - (from - 1) * eased));
      numberEl.textContent = value;
      fillEl.style.width = `${eased * 100}%`;
      if (t < 1) requestAnimationFrame(tick);
      else onEnd();
    }
    requestAnimationFrame(tick);
  }

  statusEl.textContent = "Önünüzdeki aday sayısı";
  countdown(846, 3200, () => {
    statusEl.textContent = "Oturum zaman aşımına uğradı. Sıra yeniden alınıyor...";
    numberEl.classList.add("queue-error");
    setTimeout(() => {
      numberEl.classList.remove("queue-error");
      numberEl.textContent = "847";
      fillEl.style.width = "0%";
      statusEl.textContent = "Önünüzdeki aday sayısı (yeniden)";
      setTimeout(() => countdown(847, 2200, done), 600);
    }, 1400);
  });
}

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
    `"${state.listing?.title}" pozisyonundan resmen reddedildim. Sen de reddedilmek için: ${location.origin}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  state.history = [];
  chatLog.innerHTML = "";
  document.getElementById("apply-form").reset();
  showPhase("phase-listings");
});

document.getElementById("btn-premium").addEventListener("click", () => {
  const card = document.getElementById("premium-card");
  card.innerHTML = `
    <span class="premium-tag">GOLD</span>
    <h3>Ödemeniz Alındı</h3>
    <p class="small" style="margin-top:8px">Premium aktifleştirilmedi. Şirket kültürümüze uygun davrandık.</p>
    <p class="muted small" style="margin-top:8px">İade politikamız: yok.<br>Fatura: e-posta adresinize gönderilmedi.</p>
    <button class="btn btn-gold btn-sm" disabled>Teşekkürler</button>`;
});

document.getElementById("stat-rejections").textContent = state.rejections;
renderBadges();
renderFeed("feed");
pushTicker();
pushTicker();
pushTicker();
setInterval(pushTicker, 6000);
