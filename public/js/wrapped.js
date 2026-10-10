function wrappedData() {
  const rejected = apps.filter((a) => a.status === "rejected");
  const seconds = rejected.reduce((sum, a) => sum + (a.seconds || 0), 0);
  const byCompany = {};
  for (const app of rejected) byCompany[app.company] = (byCompany[app.company] || 0) + 1;
  const topCompany = Object.entries(byCompany).sort((a, b) => b[1] - a[1])[0];
  const fastest = rejected.reduce(
    (best, a) => (a.seconds && (!best || a.seconds < best.seconds) ? a : best),
    null
  );
  const given = JSON.parse(localStorage.getItem("redin_given") || "[]");
  return {
    total: state.rejections,
    applications: apps.length,
    waiting: apps.filter((a) => a.status === "review").length,
    seconds,
    topCompany: topCompany ? topCompany[0] : null,
    topCompanyCount: topCompany ? topCompany[1] : 0,
    fastest,
    given: given.length,
  };
}

function renderWrapped() {
  const d = wrappedData();
  const box = document.getElementById("wrapped-body");

  if (!d.total) {
    box.innerHTML = `
      <p class="wrapped-lead">Bu yıl hiç reddedilmedin.</p>
      <p class="wrapped-note">Bu bir başarı değildir. Hiç başvurmadığın anlamına gelir.</p>`;
    return;
  }

  const minutes = Math.max(1, Math.round(d.seconds / 60));
  const slides = [
    {
      label: "Bu yıl toplam",
      value: d.total,
      unit: d.total === 1 ? "kez reddedildin" : "kez reddedildin",
      note: "Her biri kişiye özel gerekçelendirildi.",
    },
    {
      label: "Mülakatlarda geçirdiğin süre",
      value: minutes,
      unit: "dakika",
      note: "Bu süre iade edilmemektedir.",
    },
    {
      label: "Yanıt bekleyen başvurun",
      value: d.waiting,
      unit: d.waiting === 1 ? "başvuru" : "başvuru",
      note: "Beklemeye devam edebilirsin.",
    },
    {
      label: "İşe alınma sayın",
      value: 0,
      unit: "",
      note: "Geçen yıla göre değişim: %0.",
    },
  ];

  const extras = [];
  if (d.topCompany) {
    extras.push(
      `<li><span>Seni en çok reddeden</span><strong>${esc(d.topCompany)}</strong><em>${d.topCompanyCount} kez</em></li>`
    );
  }
  if (d.fastest) {
    extras.push(
      `<li><span>En hızlı reddin</span><strong>${esc(d.fastest.position)}</strong><em>${formatDuration(d.fastest.seconds)}</em></li>`
    );
  }
  extras.push(`<li><span>Yılın İK uzmanı</span><strong>Buket K.</strong><em>senin için</em></li>`);
  if (d.given) {
    extras.push(
      `<li><span>Senin reddettiklerin</span><strong>${d.given} aday</strong><em>işveren olarak</em></li>`
    );
  }

  box.innerHTML = `
    <div class="wrapped-slides">
      ${slides
        .map(
          (s) => `
        <div class="wrapped-slide">
          <p class="wrapped-label">${s.label}</p>
          <p class="wrapped-value">${s.value}<span>${s.unit}</span></p>
          <p class="wrapped-note">${s.note}</p>
        </div>`
        )
        .join("")}
    </div>
    <ul class="wrapped-facts">${extras.join("")}</ul>
    <p class="wrapped-rank">84.937 kullanıcı arasında <strong>sondan ${Math.max(1, 84937 - d.total)}.</strong> sıradasın.</p>`;
}

document.getElementById("btn-wrapped").addEventListener("click", () => {
  renderWrapped();
  document.getElementById("wrapped-year").textContent = new Date().getFullYear();
  showPhase("phase-wrapped");
});

document.getElementById("btn-wrapped-back").addEventListener("click", () => {
  showPhase("phase-listings");
});

function wrappedLine() {
  const d = wrappedData();
  return `${new Date().getFullYear()} Red Karnem: ${d.total} red, ${d.waiting} yanıtsız başvuru, 0 işe alım. ${location.origin}`;
}

document.getElementById("btn-wrapped-share").addEventListener("click", () => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(wrappedLine())}`, "_blank");
});

document.getElementById("btn-wrapped-linkedin").addEventListener("click", () => {
  document.getElementById("wrapped-note").textContent = shareOnLinkedIn(location.origin, wrappedLine());
});
