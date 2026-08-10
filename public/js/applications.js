const DAY = 86400000;

const SEED_APPS = [
  { position: "Stajyer (Ücretsiz)", company: "AppKardeşler Yazılım", days: 210, status: "review" },
  { position: "Frontend Developer", company: "Vizyoner Global Teknoloji A.Ş.", days: 127, status: "review" },
  { position: "Junior Backend Developer", company: "Halden Anlar Holding", days: 94, status: "reposted" },
  { position: "Ürün Yöneticisi", company: "SinerjiSoft (Vizyoner Global iştiraki)", days: 61, status: "removed" },
  { position: "Yazılım Uzmanı", company: "GüvenBank Dijital", days: 38, status: "review" },
];

const STATUS_LABEL = {
  review: "İnceleniyor",
  rejected: "Olumsuz sonuçlandı",
  reposted: "İlan yeniden yayınlandı",
  removed: "İlan kaldırıldı",
};

const STATUS_DETAIL = {
  review: (app) => `${daysSince(app.at)} gündür inceleniyor. Bilgi verilememektedir.`,
  rejected: (app) =>
    app.seconds ? `Değerlendirme süresi: ${formatDuration(app.seconds)}.` : "Süreç tamamlandı.",
  reposted: () => "Aynı pozisyon 3 hafta sonra yeniden yayınlandı. Başvurunuz aktarılmadı.",
  removed: () => "İlan kaldırıldı. Pozisyon içeriden dolduruldu.",
};

function daysSince(timestamp) {
  return Math.max(1, Math.floor((Date.now() - timestamp) / DAY));
}

function loadApps() {
  try {
    const parsed = JSON.parse(localStorage.getItem("redin_apps"));
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  const seeded = SEED_APPS.map((app, i) => ({
    id: `seed-${i}`,
    position: app.position,
    company: app.company,
    at: Date.now() - app.days * DAY,
    status: app.status,
  }));
  localStorage.setItem("redin_apps", JSON.stringify(seeded));
  return seeded;
}

let apps = loadApps();

function saveApps() {
  localStorage.setItem("redin_apps", JSON.stringify(apps.slice(-60)));
}

function recordApplication(position, company) {
  const id = `a${Date.now().toString(36)}`;
  apps.push({ id, position, company, at: Date.now(), status: "review" });
  saveApps();
  return id;
}

function markRejected(id, seconds) {
  const app = apps.find((a) => a.id === id);
  if (!app) return;
  app.status = "rejected";
  app.seconds = Math.round(seconds);
  app.rejectedAt = Date.now();
  saveApps();
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderApplications() {
  const stream = document.getElementById("feed-stream");
  document.getElementById("feed-subtitle").textContent =
    "Gönderdiğiniz başvuruların güncel durumu. Durumlar canlı olarak takip edilmemektedir.";
  const sorted = [...apps].sort((a, b) => b.at - a.at);
  const waiting = sorted.filter((a) => a.status === "review").length;

  const card = document.createElement("div");
  card.className = "card app-list";
  card.innerHTML = `
    <div class="app-summary">
      <div><strong>${sorted.length}</strong><span>başvuru</span></div>
      <div><strong>${waiting}</strong><span>yanıt bekliyor</span></div>
      <div><strong>0</strong><span>olumlu</span></div>
    </div>
    ${sorted
      .map(
        (app) => `
      <div class="app-row">
        <div class="app-info">
          <div class="app-title">${esc(app.position)}</div>
          <div class="app-company">${esc(app.company)}</div>
          <div class="app-date">${formatDate(app.at)} tarihinde başvuruldu</div>
          <div class="app-detail">${esc(STATUS_DETAIL[app.status](app))}</div>
        </div>
        <span class="app-status status-${app.status}">${STATUS_LABEL[app.status]}</span>
      </div>`
      )
      .join("")}
    <p class="fineprint">Bekleyen başvurularınız için tarafımıza dönüş yapmanıza gerek yoktur. Dönüş yapılmayacaktır.</p>`;
  stream.appendChild(card);
}
