const wallForm = document.getElementById("wall-form");
const wallInput = document.getElementById("wall-input");
const wallRole = document.getElementById("wall-role");
const wallList = document.getElementById("wall-list");
const wallError = document.getElementById("wall-error");
const wallCount = document.getElementById("wall-count");
const wallTotal = document.getElementById("wall-total");
const wallMoreBtn = document.getElementById("btn-wall-more");
const wallTeaser = document.getElementById("wall-teaser");

let wallSort = "new";
let wallOffset = 0;
let wallLoading = false;
let wallTotalCount = 0;

function renderWallTotal() {
  wallTotal.textContent = wallTotalCount
    ? `${wallTotalCount.toLocaleString("tr-TR")} kişi aynı şeyi yaşadı`
    : "";
}

function myWallSames() {
  try {
    return new Set(JSON.parse(localStorage.getItem("redin_wall_sames") || "[]"));
  } catch {
    return new Set();
  }
}

function rememberSame(id) {
  const set = myWallSames();
  set.add(id);
  localStorage.setItem("redin_wall_sames", JSON.stringify([...set]));
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days} gün önce` : `${Math.floor(days / 30)} ay önce`;
}

function buildWallItem(entry, fresh) {
  const mine = myWallSames().has(entry.id);
  const item = document.createElement("div");
  item.className = fresh ? "wall-item wall-fresh" : "wall-item";
  item.innerHTML = `
    <p class="wall-text">${esc(entry.text)}</p>
    <div class="wall-meta">
      ${entry.role ? `<span class="wall-role">${esc(entry.role)}</span>` : ""}
      <time>${esc(timeAgo(entry.at))}</time>
      <button class="wall-same${mine ? " same-done" : ""}" type="button" ${mine ? "disabled" : ""}>
        <span class="wall-same-label">${mine ? "sen de yedin" : "ben de yedim"}</span>
        <span class="wall-same-count">${entry.sames}</span>
      </button>
    </div>`;

  const btn = item.querySelector(".wall-same");
  btn.addEventListener("click", async () => {
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      const res = await fetch(`/api/wall/${entry.id}/same`, { method: "POST" });
      const data = await res.json();
      if (typeof data.sames !== "number") throw new Error();
      btn.querySelector(".wall-same-count").textContent = data.sames;
      btn.querySelector(".wall-same-label").textContent = "sen de yedin";
      btn.classList.add("same-done");
      rememberSame(entry.id);
      play("ding");
    } catch {
      btn.disabled = false;
    }
  });
  return item;
}

async function loadWall(reset) {
  if (wallLoading) return;
  wallLoading = true;
  if (reset) {
    wallOffset = 0;
    wallList.innerHTML = '<p class="muted small">Yükleniyor...</p>';
  }
  try {
    const res = await fetch(`/api/wall?sort=${wallSort}&offset=${wallOffset}`);
    const data = await res.json();
    if (reset) wallList.innerHTML = "";
    if (!data.total) {
      wallList.innerHTML =
        '<p class="muted small">Duvar henüz boş. İlk itirafı sen as, birileri mutlaka "ben de" diyecek.</p>';
    }
    for (const entry of data.entries) wallList.appendChild(buildWallItem(entry));
    wallOffset += data.entries.length;
    wallTotalCount = data.total;
    renderWallTotal();
    wallMoreBtn.hidden = wallOffset >= data.total;
  } catch {
    if (reset) {
      wallList.innerHTML = '<p class="muted small">Duvar yüklenemedi. Duvar da bugünlük pes etti.</p>';
    }
  }
  wallLoading = false;
}

wallInput.addEventListener("input", () => {
  wallCount.textContent = `${wallInput.value.length} / 220`;
  wallError.textContent = "";
});

wallForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = wallForm.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Asılıyor...";
  wallError.textContent = "";
  try {
    const res = await fetch("/api/wall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: wallInput.value, role: wallRole.value }),
    });
    const data = await res.json();
    if (!res.ok) {
      wallError.textContent = data.error || "Asılamadı.";
    } else {
      if (wallSort !== "new") switchWallSort("new");
      wallList.querySelector(".muted")?.remove();
      wallList.prepend(buildWallItem(data, true));
      wallTotalCount += 1;
      wallOffset += 1;
      renderWallTotal();
      wallInput.value = "";
      wallCount.textContent = "0 / 220";
      play("ding");
      wallError.textContent = "";
      wallError.classList.add("wall-ok");
      wallError.textContent = "Duvara asıldı. Yalnız değilsin.";
      setTimeout(() => {
        wallError.textContent = "";
        wallError.classList.remove("wall-ok");
      }, 4000);
    }
  } catch {
    wallError.textContent = "Bağlantı kurulamadı. Bunu da olumsuz değerlendireceğiz.";
  }
  btn.disabled = false;
  btn.textContent = "Duvara As";
});

function switchWallSort(sort) {
  wallSort = sort;
  document.getElementById("wall-tab-new").classList.toggle("active", sort === "new");
  document.getElementById("wall-tab-top").classList.toggle("active", sort === "top");
  loadWall(true);
}

document.getElementById("wall-tab-new").addEventListener("click", () => switchWallSort("new"));
document.getElementById("wall-tab-top").addEventListener("click", () => switchWallSort("top"));
wallMoreBtn.addEventListener("click", () => loadWall(false));

function openWall(prefill) {
  document.body.classList.remove("landing-open");
  if (location.pathname !== "/duvar") history.pushState({}, "", "/duvar");
  showPhase("phase-wall");
  if (prefill) {
    wallInput.value = prefill.slice(0, 220);
    wallCount.textContent = `${wallInput.value.length} / 220`;
  }
  loadWall(true);
}

document.getElementById("btn-open-wall").addEventListener("click", () => openWall());

async function loadWallTeaser() {
  try {
    const res = await fetch("/api/wall?sort=top");
    const data = await res.json();
    if (!data.total) return;
    wallTeaser.textContent = `${data.total.toLocaleString("tr-TR")} itiraf asılı.`;
  } catch {}
}

loadWallTeaser();
