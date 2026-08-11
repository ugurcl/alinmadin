const state = {
  name: "",
  position: "",
  listing: null,
  history: [],
  rejections: Number(localStorage.getItem("redin_rejections") || 0),
  lastName: localStorage.getItem("redin_name") || "",
  startedAt: 0,
  durationSeconds: 0,
  shareUrl: "",
};

function formatDuration(totalSeconds) {
  const seconds = Math.max(1, Math.round(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (!mins) return `${secs} saniye`;
  return `${mins} dakika ${secs} saniye`;
}

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
      ${personAvatar(post.photo, post.initials, "post-avatar", color)}
      <div class="post-author">
        <strong>${post.author}</strong>${post.photo ? PARODY_TAG : ""}<span class="post-follow"> · Takip Et</span>
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
  const heading = document.querySelector(".feed-head h2");
  heading.textContent = tab === "apps" ? "Başvurularım" : "Senin için önerilenler";
  if (tab === "apps") {
    renderApplications();
    return;
  }
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
  document.getElementById("tab-apps").classList.toggle("active", tab === "apps");
  document.getElementById("nav-home").classList.toggle("active", tab === "feed");
  document.getElementById("nav-jobs").classList.toggle("active", tab === "jobs");
  renderFeed(tab);
}

document.getElementById("tab-feed").addEventListener("click", () => activateTab("feed"));
document.getElementById("tab-jobs").addEventListener("click", () => activateTab("jobs"));
document.getElementById("tab-apps").addEventListener("click", () => activateTab("apps"));

function setupDropdown(navId, panelId) {
  const nav = document.getElementById(navId);
  const panel = document.getElementById(panelId);
  nav.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = panel.hidden;
    document.querySelectorAll(".dropdown").forEach((d) => (d.hidden = true));
    panel.hidden = !willOpen;
  });
  panel.addEventListener("click", (e) => e.stopPropagation());
}

document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown").forEach((d) => (d.hidden = true));
});

setupDropdown("nav-messages", "panel-messages");
setupDropdown("nav-notifications", "panel-notifications");

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

const TICKER_NAMES = ["Mehmet K.", "Ayşe T.", "Emre D.", "Zeynep A.", "Burak S.", "Elif Y.", "Can Ö.", "Selin M.", "Oğuz H.", "Merve B.", "Kaan İ.", "Deniz P.", "Sibel R.", "Tolga V.", "Ece N.", "Barış G.", "Nazlı U.", "Serdar F."];
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
  "mülakatta su istediği için reddedildi (talepkâr)",
  "su istemediği için reddedildi (inisiyatif eksikliği)",
  "CV'si tek sayfa olduğu için reddedildi",
  "CV'si iki sayfa olduğu için reddedildi",
  "zayıf yönünü 'mükemmeliyetçilik' olarak belirttiği için reddedildi",
  "zayıf yönünü gerçekten söylediği için reddedildi",
  "yıllık izin haklarını sorduğu için reddedildi",
  "LinkedIn fotoğrafında kravat takmadığı için reddedildi",
  "LinkedIn fotoğrafında kravat taktığı için reddedildi (fazla resmi)",
  "mülakat linkine 2 dakika erken girdiği için reddedildi",
  "'sizin için sorum var mı' sorusuna soru sorduğu için reddedildi",
  "'sorum yok' dediği için reddedildi (ilgisiz)",
  "önceki işinden iyi bahsettiği için reddedildi (bağlılık riski)",
  "önceki işinden kötü bahsettiği için reddedildi (sadakatsiz)",
  "kamerasının arkasında kitaplık olduğu için reddedildi (gösterişçi)",
  "kamerasının arkasında duvar olduğu için reddedildi (derinliksiz)",
  "adının söylenişini düzelttiği için reddedildi",
  "mülakatta not aldığı için reddedildi (aklında tutamıyor)",
  "hafta sonu çalışabileceğini söylediği için reddedildi (çaresiz görünüyor)",
  "kendini üç kelimeyle tanımlarken dördüncü kelimeyi kullandığı için reddedildi",
  "teşekkür maili attığı için reddedildi (fazla istekli)",
  "teşekkür maili atmadığı için reddedildi (ilgisiz)",
];

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const LEGEND_REJECTIONS = [
  { name: "Guido van Rossum", photo: "guido-van-rossum", initials: "GvR", reason: "Kıdemli Python Geliştirici pozisyonundan reddedildi (Django deneyimi yok)" },
  { name: "Brendan Eich", photo: "brendan-eich", initials: "BE", reason: "Frontend pozisyonundan reddedildi (gerçekçi olmayan süre tahmini)" },
  { name: "James Gosling", photo: "james-gosling", initials: "JG", reason: "Java Developer pozisyonundan reddedildi (Spring Boot şartı karşılanmadı)" },
  { name: "Bjarne Stroustrup", photo: "bjarne-stroustrup", initials: "BS", reason: "C++ pozisyonundan reddedildi (çoktan seçmeli testte şık tartıştı)" },
  { name: "Rasmus Lerdorf", photo: "rasmus-lerdorf", initials: "RL", reason: "PHP pozisyonundan reddedildi (ölmekte olan teknoloji)" },
  { name: "Yukihiro Matsumoto", photo: "yukihiro-matsumoto", initials: "YM", reason: "Ruby pozisyonundan reddedildi (mutluluk ölçülebilir bir KPI değil)" },
  { name: "Linus Torvalds", photo: "linus-torvalds", initials: "LT", reason: "Git uzmanı pozisyonundan reddedildi (kod incelemede fazla doğrudan)" },
  { name: "Ryan Dahl", photo: "ryan-dahl", initials: "RD", reason: "Backend pozisyonundan reddedildi (kendi işine olumsuz bakış)" },
  { name: "Graydon Hoare", initials: "GH", reason: "Rust pozisyonundan reddedildi (sahiplik modeli ekipçe anlaşılamadı)" },
  { name: "Larry Wall", photo: "larry-wall", initials: "LW", reason: "Perl pozisyonundan reddedildi (CV'si tek satırda yazılmıştı)" },
  { name: "Chris Lattner", photo: "chris-lattner", initials: "CL", reason: "iOS pozisyonundan reddedildi (Swift bilgisi teoride kalmış)" },
  { name: "Anders Hejlsberg", photo: "anders-hejlsberg", initials: "AH", reason: "TypeScript pozisyonundan reddedildi (C# tecrübesi fazla ağır)" },
  { name: "Rob Pike", photo: "rob-pike", initials: "RP", reason: "Go pozisyonundan reddedildi (jenerik beklentisi netleştirilemedi)" },
  { name: "José Valim", initials: "JV", reason: "Elixir pozisyonundan reddedildi (niş teknoloji, kariyer riski)" },
  { name: "Martin Odersky", photo: "martin-odersky", initials: "MO", reason: "Scala pozisyonundan reddedildi (fazla fonksiyonel yaklaşım)" },
  { name: "Rich Hickey", photo: "rich-hickey", initials: "RH", reason: "Clojure pozisyonundan reddedildi (parantez kullanımı aşırı bulundu)" },
  { name: "Alan Kay", photo: "alan-kay", initials: "AK", reason: "OOP pozisyonundan reddedildi (nesne yönelimli programlamayı yanlış tanımladı)" },
  { name: "Roberto Ierusalimschy", photo: "roberto-ierusalimschy", initials: "RI", reason: "Lua pozisyonundan reddedildi (dizinler 1'den başlıyor diye)" },
];

function shortName(full) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Bir Aday";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toLocaleUpperCase("tr")}.`;
}

function givenRejections() {
  try {
    return JSON.parse(localStorage.getItem("redin_given")) || [];
  } catch {
    return [];
  }
}

function pushTicker(opts = {}) {
  const ticker = document.getElementById("ticker");
  const given = givenRejections();
  const mine = !opts.own && given.length && Math.random() < 0.25
    ? given[Math.floor(Math.random() * given.length)]
    : null;
  const legend = !opts.own && !mine && Math.random() < 0.3
    ? LEGEND_REJECTIONS[Math.floor(Math.random() * LEGEND_REJECTIONS.length)]
    : null;
  const source = mine || legend;
  const raw = opts.name || source?.name || TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
  const name = opts.own ? shortName(raw) : raw;
  const reason = source ? source.reason : TICKER_REASONS[Math.floor(Math.random() * TICKER_REASONS.length)];
  const initials = source?.initials || name.split(" ").map((p) => p[0]).join("");
  const color = LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
  const item = document.createElement("div");
  item.className = opts.own ? "ticker-item own" : "ticker-item";
  item.innerHTML = `
    ${personAvatar(source?.photo, esc(initials), "ticker-avatar", color)}
    <div><strong>${esc(name)}</strong>${source?.photo ? PARODY_TAG : ""}${mine ? '<span class="by-you">senin kararın</span>' : ""} ${esc(reason)}<time>${opts.own ? "şu anda" : "az önce"}</time></div>`;
  ticker.prepend(item);
  while (ticker.children.length > 5) {
    const removable = [...ticker.children].reverse().find((el) => !el.classList.contains("own"));
    if (!removable) break;
    removable.remove();
  }
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role === "user" ? "user" : "hr"}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function addSystem(text) {
  const div = document.createElement("div");
  div.className = "msg system";
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

const SYSTEM_EVENTS = [
  "[Buket ekranını paylaştı ve hemen geri aldı]",
  "[Buket 14 saniye boyunca hiçbir şey yazmadı]",
  "[Buket bir sekmeye geçti]",
  "[Buket not alıyor]",
  "[Buket birine bir şey fısıldadı]",
  "[Buket CV'nizi yeniden açtı]",
  "[Buket kısa bir kahkaha attı — mikrofonu kapalıydı]",
  "[Buket takvimini kontrol etti]",
];

const usedEvents = new Set();

function randomSystemEvent() {
  const pool = SYSTEM_EVENTS.filter((e) => !usedEvents.has(e));
  if (!pool.length) return null;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  usedEvents.add(pick);
  return pick;
}

const KEREM_SCRIPT = [
  [1400, "[Teknik ekipten Kerem Bey görüşmeye katıldı]"],
  [4200, "[Kerem Bey kamerasını açmadı]"],
  [7600, "[Kerem Bey görüşmeden ayrıldı]"],
];

function runKeremCameo() {
  for (const [delay, line] of KEREM_SCRIPT) {
    setTimeout(() => {
      if (document.getElementById("phase-interview").classList.contains("active")) {
        addSystem(line);
      }
    }, delay);
  }
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

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function replyDelay() {
  const lastUser = [...state.history].reverse().find((m) => m.role === "user");
  const len = lastUser ? lastUser.text.length : 0;
  return Math.max(400, Math.min(2600, 2600 - len * 6));
}

async function sendToHr() {
  setBusy(true);
  const started = performance.now();
  const target = replyDelay();
  const typing = addTyping();
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: state.history, name: state.name }),
    });
    const data = await res.json();
    await wait(Math.max(0, target - (performance.now() - started)));
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
    const userTurns = state.history.filter((m) => m.role === "user").length;
    if (userTurns > 1 && Math.random() < 0.5) {
      const event = randomSystemEvent();
      if (event) addSystem(event);
    }
    state.history.push({ role: "model", text: data.text });
    addMessage("hr", data.text);
    setBusy(false);
    if (userTurns === 2) runKeremCameo();
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

function playFakeOffer(onDone) {
  const card = document.querySelector(".rejection");
  const box = document.getElementById("fake-offer");
  const textEl = document.getElementById("fake-offer-text");
  const titleEl = document.getElementById("fake-offer-title");
  const line = `Sayın ${state.name || "Aday"}, değerlendirme sürecimiz olumlu sonuçlanmıştır. Sizi ekibimizde görmekten büyük mutluluk duyacağız.`;

  titleEl.textContent = "Tebrikler!";
  textEl.textContent = "";
  box.hidden = false;
  box.classList.remove("erasing");
  card.classList.remove("slam", "shake");
  card.classList.add("revealing");
  showPhase("phase-rejection");

  let i = 0;
  const type = () => {
    textEl.textContent = line.slice(0, ++i);
    if (i < line.length) return setTimeout(type, 22);
    setTimeout(erase, 1500);
  };

  const erase = () => {
    box.classList.add("erasing");
    titleEl.textContent = "Tebrikler";
    const step = () => {
      textEl.textContent = line.slice(0, --i);
      if (i > 0) return setTimeout(step, 9);
      titleEl.textContent = "";
      setTimeout(() => {
        box.hidden = true;
        card.classList.remove("revealing");
        onDone();
      }, 450);
    };
    step();
  };

  setTimeout(type, 400);
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
  state.durationSeconds = state.startedAt ? (performance.now() - state.startedAt) / 1000 : 0;
  if (state.appId) markRejected(state.appId, state.durationSeconds);
  resetAppealZone();
  playFakeOffer(() => {
    document.getElementById("rejection-text").textContent = letter;
    document.getElementById("duration-note").textContent = state.durationSeconds
      ? `Değerlendirme süreniz: ${formatDuration(state.durationSeconds)}. ` +
        (state.durationSeconds > 180
          ? "Ortalamamız 3 dakikadır, sizi bekletmiş olduk. Özür dileriz."
          : "Ortalamamızın altında kaldınız. Bu bir iltifat değildir.")
      : "";
    renderCertificate(state.name, state.position, letter, state.listing?.company);
    const card = document.querySelector(".rejection");
    requestAnimationFrame(() => card.classList.add("slam", "shake"));
    setTimeout(() => play("thud"), 340);
    setTimeout(renderRival, 1400);
    dropConfetti();
    refreshRealStats();
    pushTicker({ name: state.name, own: true });
  });
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
  state.startedAt = performance.now();
  state.shareUrl = "";
  localStorage.setItem("redin_name", state.name);
  state.appId = recordApplication(state.position, state.listing?.company || "");
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

const chatHint = document.getElementById("chat-hint");

const HINT_STEPS = [
  [0, ""],
  [40, "Ortalama ilgi süremiz 40 karakterdir."],
  [90, "Bu cevap uzuyor. Buket ilk cümleyi okuyacaktır."],
  [160, "Yazdıklarınızın bir kısmı okunmayacaktır."],
  [260, "Bu noktadan sonrası kendi keyfiniz için."],
  [380, "Buket sekme değiştirdi."],
];

chatInput.addEventListener("input", () => {
  const len = chatInput.value.length;
  const step = [...HINT_STEPS].reverse().find(([min]) => len > min);
  chatHint.textContent = step ? step[1] : "";
  chatHint.classList.toggle("warn", len > 160);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || chatInput.disabled) return;
  chatInput.value = "";
  chatHint.textContent = "";
  chatHint.classList.remove("warn");
  state.history.push({ role: "user", text });
  addMessage("user", text);
  sendToHr();
});

document.getElementById("btn-download").addEventListener("click", downloadCertificate);

document.getElementById("btn-tweet").addEventListener("click", () => {
  const text = encodeURIComponent(
    `"${state.listing?.title}" pozisyonundan resmen reddedildim. Red mektubum: ${state.shareUrl || location.origin}`
  );
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

const appealBtn = document.getElementById("btn-appeal");
const appealForm = document.getElementById("appeal-form");
const appealInput = document.getElementById("appeal-input");
const appealLog = document.getElementById("appeal-log");

const APPEAL_CTA = [
  "Bu karara itiraz etmek istiyorum",
  "Yine de itiraz etmek istiyorum",
  "Son bir kez itiraz etmek istiyorum",
  "İtiraz etmeye devam etmek istiyorum",
];

function resetAppealZone() {
  state.appeals = 0;
  appealLog.innerHTML = "";
  appealInput.value = "";
  appealForm.hidden = true;
  appealBtn.hidden = false;
  appealBtn.textContent = APPEAL_CTA[0];
}

function addAppealEntry(kind, text, meta) {
  const div = document.createElement("div");
  div.className = `appeal-entry ${kind}`;
  div.textContent = text;
  if (meta) {
    const span = document.createElement("span");
    span.className = "appeal-meta";
    span.textContent = meta;
    div.appendChild(span);
  }
  appealLog.appendChild(div);
  return div;
}

appealBtn.addEventListener("click", () => {
  appealBtn.hidden = true;
  appealForm.hidden = false;
  appealInput.focus();
});

appealForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = appealInput.value.trim();
  if (!text) return;
  appealInput.value = "";
  appealForm.hidden = true;
  state.appeals = (state.appeals || 0) + 1;
  addAppealEntry("mine", `İtirazınız: ${text}`, `İtiraz no: ${state.appeals} · Durum: alındı`);

  const history = [
    ...state.history,
    { role: "model", text: document.getElementById("rejection-text").textContent },
    { role: "user", text },
  ];

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, name: state.name, mode: "appeal" }),
    });
    const data = await res.json();
    addAppealEntry("verdict", data.text || data.error, `İtiraz no: ${state.appeals} · Durum: kapatıldı`);
  } catch {
    addAppealEntry("verdict", "İtirazınız gönderilemedi. Bu da bir cevaptır.", `İtiraz no: ${state.appeals} · Durum: kapatıldı`);
  }

  if (state.appeals < APPEAL_CTA.length) {
    appealBtn.textContent = APPEAL_CTA[state.appeals];
    appealBtn.hidden = false;
  } else {
    addAppealEntry("mine", "İtiraz hakkınız tükenmiştir.", "Yeni hak tanımlanmamıştır.");
  }
});

document.getElementById("btn-retry").addEventListener("click", () => {
  state.history = [];
  state.shareUrl = "";
  chatLog.innerHTML = "";
  document.getElementById("apply-form").reset();
  document.getElementById("share-note").textContent = "";
  document.getElementById("btn-share").hidden = false;
  resetRival();
  showPhase("phase-listings");
  activateTab("feed");
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

const cookieBanner = document.getElementById("cookie-banner");
if (!sessionStorage.getItem("redin_cookies")) {
  setTimeout(() => (cookieBanner.hidden = false), 900);
}
document.querySelectorAll(".cookie-accept").forEach((btn) =>
  btn.addEventListener("click", () => {
    sessionStorage.setItem("redin_cookies", "1");
    document.getElementById("cookie-text").textContent = btn.dataset.reject
      ? "Reddetme tercihiniz kabul olarak kaydedildi."
      : "Tercihiniz kaydedildi. (Zaten tek tercihti.)";
    document.querySelector(".cookie-actions").remove();
    setTimeout(() => cookieBanner.classList.add("cookie-out"), 1600);
    setTimeout(() => cookieBanner.remove(), 2200);
  })
);

async function refreshRealStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    document.getElementById("stat-real").textContent = data.rejections.toLocaleString("tr-TR");
  } catch {}
}

const REAL_TITLE = document.title;
let titleTimer;
document.addEventListener("visibilitychange", () => {
  clearTimeout(titleTimer);
  if (document.hidden) {
    document.title = "(1) Buket sizi bekliyor...";
  } else {
    document.title = "Geç kaldınız.";
    titleTimer = setTimeout(() => (document.title = REAL_TITLE), 2200);
  }
});

const notifNav = document.getElementById("nav-notifications");
const notifCount = notifNav.querySelector(".nav-count");
let notifSeen = false;
notifNav.addEventListener("click", () => {
  if (notifSeen) return;
  notifSeen = true;
  notifCount.textContent = "1";
  const panel = document.getElementById("panel-notifications");
  const item = document.createElement("div");
  item.className = "dd-item";
  item.innerHTML = `<span class="dd-dot"></span><div class="dd-body"><p>Bu bildirim size ait değil.</p><span class="dd-time">şimdi</span></div>`;
  panel.insertBefore(item, panel.children[1]);
});

const completeBtn = document.getElementById("btn-complete");
let completeStep = 0;
completeBtn.addEventListener("click", () => {
  completeStep += 1;
  if (completeStep === 1) {
    document.getElementById("completion-fill").style.width = "87%";
    document.getElementById("completion-pct").textContent = "%87";
    completeBtn.textContent = "Son %13 için biraz daha";
    return;
  }
  completeBtn.textContent = "Profiliniz bu kadar tamamlanabilir.";
  completeBtn.disabled = true;
});

const applyBtn = document.getElementById("btn-apply");
let applyDodged = false;
applyBtn.addEventListener("mouseenter", () => {
  if (applyDodged) return;
  applyDodged = true;
  applyBtn.style.transition = "transform 0.18s ease";
  applyBtn.style.transform = "translateX(72px)";
  setTimeout(() => (applyBtn.style.transform = "none"), 520);
});

document.getElementById("stat-rejections").textContent = state.rejections;
renderBadges();
renderPhotoCredits();
renderFeed("feed");
refreshRealStats();
pushTicker();
pushTicker();
pushTicker();
setInterval(pushTicker, 6000);
