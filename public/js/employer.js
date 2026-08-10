const TECH_JOBS = [
  {
    tech: "Node.js",
    role: "Node.js Backend Geliştirici",
    creator: {
      display: "Ryan D.",
      headline: "Yazılım Geliştirici · Açık kaynak projeler",
      cv: [
        "2009'da sunucu tarafında JavaScript çalıştıran bir ortam geliştirdim.",
        "Son yıllarda aynı işi baştan yapan ikinci bir çalışma ortamı üzerinde çalışıyorum.",
        "Kurumsal deneyim: yok. Sertifika: yok.",
      ],
      real: "Ryan Dahl",
      photo: "ryan-dahl",
      credit: "Node.js'in (2009) ve Deno'nun (2018) yaratıcısı",
      reply: "Anlıyorum. Zaten Node.js hakkında bir konuşmamda pişmanlıklarımı sıralamıştım. Sizinki de listeye eklenir.",
    },
  },
  {
    tech: "Python",
    role: "Kıdemli Python Geliştirici",
    creator: {
      display: "Guido v.",
      headline: "Yazılım Geliştirici · Hollanda",
      cv: [
        "1989 yılbaşı tatilinde bir betik dili yazmaya başladım, hâlâ üzerinde çalışıyorum.",
        "Uzun süre projenin karar mercii olarak görev yaptım, 2018'de bıraktım.",
        "Django veya Flask ile ticari proje deneyimim bulunmuyor.",
      ],
      real: "Guido van Rossum",
      photo: "guido-van-rossum",
      credit: "Python'un yaratıcısı (1991)",
      reply: "Girintileme konusunda esnek olamadığımı kabul ediyorum. Bu benim en tutarlı özelliğim.",
    },
  },
  {
    tech: "JavaScript",
    role: "Frontend Geliştirici (JavaScript)",
    creator: {
      display: "Brendan E.",
      headline: "Yazılım Geliştirici · Tarayıcı teknolojileri",
      cv: [
        "1995'te bir tarayıcı için betik dili tasarladım. Süre kısıtlıydı, 10 günde teslim ettim.",
        "Bazı tasarım kararlarım bugün hâlâ tartışılıyor.",
        "React, Vue veya Angular ile production deneyimim yok.",
      ],
      real: "Brendan Eich",
      photo: "brendan-eich",
      credit: "JavaScript'in yaratıcısı (1995)",
      reply: "10 gün gerçekten kısaydı. Sonuçlarını 30 yıldır birlikte yaşıyoruz. Kararınıza saygı duyuyorum.",
    },
  },
  {
    tech: "Java",
    role: "Java Backend Geliştirici",
    creator: {
      display: "James G.",
      headline: "Yazılım Mühendisi · Sanal makineler",
      cv: [
        "Platformdan bağımsız çalışan bir dil ve onun sanal makinesini tasarladım (1995).",
        "Çöp toplama ve tip sistemi tasarımı üzerine uzun süre çalıştım.",
        "Spring Boot deneyimim yok.",
      ],
      real: "James Gosling",
      photo: "james-gosling",
      credit: "Java'nın yaratıcısı (1995)",
      reply: "Spring Boot'u gerçekten bilmiyorum. Bu konuda haklısınız. Dili yazmış olmam bunu telafi etmiyor.",
    },
  },
  {
    tech: "C++",
    role: "C++ Gömülü Sistem Geliştirici",
    creator: {
      display: "Bjarne S.",
      headline: "Yazılım Mühendisi · Sistem programlama",
      cv: [
        "C diline sınıf yapısı ekleyerek başladım, iş zamanla büyüdü (1985).",
        "Nesne yönelimli tasarım ve şablonlar üzerine çalıştım.",
        "Çoktan seçmeli teknik testinizde iki soruya itiraz şerhi düştüm.",
      ],
      real: "Bjarne Stroustrup",
      photo: "bjarne-stroustrup",
      credit: "C++'ın yaratıcısı (1985)",
      reply: "Testteki iki sorunun doğru şıkkı hâlâ yok. Ama bu artık sizin sorununuz değil.",
    },
  },
  {
    tech: "Ruby",
    role: "Ruby on Rails Geliştirici",
    creator: {
      display: "Yukihiro M.",
      headline: "Yazılım Geliştirici · Japonya",
      cv: [
        "1995'te, geliştiricinin mutluluğunu merkeze alan bir dil tasarladım.",
        "Tasarım felsefem ölçülebilir çıktılardan çok kullanım keyfine dayanıyor.",
        "Rails ile kurumsal ölçekli proje referansım bulunmuyor.",
      ],
      real: "Yukihiro Matsumoto (Matz)",
      photo: "yukihiro-matsumoto",
      credit: "Ruby'nin yaratıcısı (1995)",
      reply: "Mutluluğun çeyreklik hedeflere dönüştürülemediğini kabul ediyorum. Yine de denemeye devam edeceğim.",
    },
  },
  {
    tech: "Go",
    role: "Go Mikroservis Geliştirici",
    creator: {
      display: "Rob P.",
      headline: "Yazılım Mühendisi · Dağıtık sistemler",
      cv: [
        "Derleme süreleri uzadığı için iki meslektaşımla yeni bir dil tasarladık (2009).",
        "Öncesinde uzun yıllar işletim sistemi ve metin işleme araçları üzerine çalıştım.",
        "Jenerik desteğini dile geç eklediğimiz eleştirisini kabul ediyorum.",
      ],
      real: "Rob Pike",
      photo: "rob-pike",
      credit: "Go'nun yaratıcılarından (2009)",
      reply: "Jenerikleri geç ekledik, bu doğru. Sizin de kararınız geç gelmedi, hemen bildirdiniz. Teşekkürler.",
    },
  },
  {
    tech: "Rust",
    role: "Rust Sistem Geliştirici",
    creator: {
      display: "Graydon H.",
      headline: "Yazılım Geliştirici · Derleyiciler",
      cv: [
        "Apartmanımın asansör yazılımı çöktükten sonra bellek güvenli bir dil yazmaya başladım (2006).",
        "Projeyi bir süre sonra topluluğa devrettim.",
        "Sahiplik ve ödünç alma modelini anlatmak zaman alıyor, bunun farkındayım.",
      ],
      real: "Graydon Hoare",
      credit: "Rust'ın yaratıcısı (2006)",
      reply: "Ödünç alma denetleyicisini 40 dakikada anlatamadığım için özür dilerim. Derleyici de aynı şeyi bana yapıyor.",
    },
  },
  {
    tech: "Git",
    role: "DevOps / Sürüm Kontrol Uzmanı",
    creator: {
      display: "Linus T.",
      headline: "Yazılım Geliştirici · Finlandiya",
      cv: [
        "1991'de hobi olarak bir işletim sistemi çekirdeği yazmaya başladım, büyük bir şey olmasını beklemiyordum.",
        "2005'te ekibimizin ihtiyacı için bir sürüm kontrol sistemi yazdım.",
        "Kod incelemelerinde doğrudan geri bildirim verdiğim yönünde eleştiriler aldım.",
      ],
      real: "Linus Torvalds",
      photo: "linus-torvalds",
      credit: "Linux (1991) ve Git'in (2005) yaratıcısı",
      reply: "Kod incelemesinde doğrudan konuştuğum doğru. Red mailiniz de gayet doğrudandı. Anlaşıyoruz.",
    },
  },
  {
    tech: "TypeScript",
    role: "TypeScript Geliştirici",
    creator: {
      display: "Anders H.",
      headline: "Yazılım Mimarı · Dil tasarımı",
      cv: [
        "JavaScript'e kademeli tip sistemi ekleyen bir dil tasarladım (2012).",
        "Öncesinde bir derleyici, bir geliştirme ortamı ve bir dil daha tasarladım.",
        "Kıdem seviyem ilanınızdaki aralığın üzerinde kalıyor olabilir.",
      ],
      real: "Anders Hejlsberg",
      photo: "anders-hejlsberg",
      credit: "TypeScript, C#, Delphi ve Turbo Pascal'ın mimarı",
      reply: "Fazla kıdemli olduğumu ilk kez duymuyorum. Genelde bu cümleden sonra maaş konuşulmuyor.",
    },
  },
];

const FILLER_CANDIDATES = [
  {
    display: "Kerem Y.",
    headline: "Kıdemli Yazılım Uzmanı · Tüm teknolojiler",
    cvFn: (tech) => [
      `${tech} konusunda 25 yıl kesintisiz deneyim.`,
      `${tech}'in ilk sürümünden önce de ${tech} kullanıyordum.`,
      "Referans: kendisi.",
    ],
    real: "Kerem Y.",
    credit: "Deneyim yılı, teknolojinin yaşından fazla",
    reply: "Deneyim yılımı sorgulamanız beni şaşırttı. 25 yıl önce de aynı şeyi söylemiştim.",
  },
  {
    display: "Selin A.",
    headline: "Yazılım Geliştirici · 6 yıl deneyim",
    cvFn: (tech) => [
      `${tech} ile 6 yıldır production ortamında çalışıyorum.`,
      "İlandaki tüm teknik şartları karşılıyorum, referanslarım güçlü.",
      "Maaş beklentim: sektör ortalaması.",
    ],
    real: "Selin A.",
    credit: "İlandaki her şartı karşılayan tek aday",
    reply: "Sektör ortalaması istediğim için elendiğimi anlıyorum. Bir dahakine ortalamanın altını yazarım.",
  },
];

const REJECT_REASONS = [
  "Aradığımız profille tam örtüşmüyor",
  "Deneyim süresi yetersiz",
  "Fazla kıdemli, pozisyona uygun değil",
  "Maaş beklentisi bütçemizin üzerinde",
  "Kültürel uyum sağlayamayacağını düşünüyoruz",
  "Teknoloji yığınımızla deneyimi yok",
  "CV formatı standartlarımıza uygun değil",
  "Sebep belirtmek istemiyorum",
];

const employer = { job: null, queue: [], index: 0, rejected: [], company: "" };

function buildQueue(job) {
  const creator = { ...job.creator, isCreator: true };
  const fillers = FILLER_CANDIDATES.map((f) => ({
    display: f.display,
    headline: f.headline,
    cv: f.cvFn(job.tech),
    real: f.real,
    credit: f.credit,
    reply: f.reply,
    isCreator: false,
  }));
  return [fillers[0], creator, fillers[1]];
}

function employerAvatar(name, seed) {
  const initials = name.split(/\s+/).map((p) => p[0]).join("").slice(0, 3);
  return `<div class="cand-avatar" style="background:${LOGO_COLORS[seed % LOGO_COLORS.length]}">${esc(initials)}</div>`;
}

function showEmployerCard(id) {
  ["employer-form-card", "employer-review-card", "employer-summary-card"].forEach((cardId) => {
    document.getElementById(cardId).hidden = cardId !== id;
  });
}

function renderCandidate() {
  const cand = employer.queue[employer.index];
  const box = document.getElementById("candidate-box");
  document.getElementById("applicant-progress").textContent =
    `Başvuru ${employer.index + 1} / ${employer.queue.length}`;
  box.innerHTML = `
    <div class="cand-head">
      ${employerAvatar(cand.display, employer.index + 3)}
      <div>
        <strong>${esc(cand.display)}</strong>
        <p class="muted small">${esc(cand.headline)}</p>
      </div>
    </div>
    <ul class="cand-cv">${cand.cv.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`;
  document.getElementById("reveal-box").innerHTML = "";
  document.getElementById("reject-panel").hidden = true;
  document.getElementById("decision-row").hidden = false;
  document.getElementById("btn-hire").disabled = false;
  document.getElementById("btn-hire").textContent = "Olumlu Değerlendir";
  document.getElementById("hire-error").textContent = "";
  document.getElementById("btn-next").hidden = true;
}

function revealCandidate(reason) {
  const cand = employer.queue[employer.index];
  employer.rejected.push({ ...cand, reason });
  document.getElementById("decision-row").hidden = true;
  document.getElementById("reject-panel").hidden = true;
  const box = document.getElementById("reveal-box");
  const face = cand.photo && PHOTOS[cand.photo]
    ? `<img class="reveal-photo" src="${photoSrc(cand.photo)}" alt="${esc(cand.real)}" width="96" height="96">`
    : "";
  box.innerHTML = `
    <div class="reveal ${cand.isCreator ? "reveal-big" : ""}">
      ${face}
      <div class="reveal-body">
        <p class="reveal-label">Reddettiğiniz kişi</p>
        <h3>${esc(cand.real)}${cand.photo ? PARODY_TAG : ""}</h3>
        <p class="reveal-credit">${esc(cand.credit)}</p>
        <p class="reveal-reason">Gerekçeniz: “${esc(reason)}”</p>
        <p class="reveal-reply">${esc(cand.reply)}</p>
      </div>
    </div>`;
  const next = document.getElementById("btn-next");
  next.hidden = false;
  next.textContent = employer.index + 1 < employer.queue.length ? "Sıradaki Başvuru" : "İlanı Kapat";
}

function renderEmployerSummary() {
  showEmployerCard("employer-summary-card");
  const creator = employer.rejected.find((c) => c.isCreator);
  document.getElementById("summary-title").textContent = `${employer.company} · ${employer.job.role}`;
  document.getElementById("summary-list").innerHTML = employer.rejected
    .map((c) => `<li><strong>${esc(c.real)}</strong> — ${esc(c.reason)}</li>`)
    .join("");
  document.getElementById("summary-verdict").innerHTML = creator
    ? `<strong>${esc(creator.real)}</strong> — ${esc(creator.credit)} — bu ilana başvurdu ve tarafınızca reddedildi.<br>
       ${esc(employer.job.tech)} ilanınız için uygun aday bulunamamıştır. Piyasada nitelikli insan kalmamış.`
    : "Uygun aday bulunamamıştır.";
}

document.getElementById("btn-open-employer").addEventListener("click", () => {
  showEmployerCard("employer-form-card");
  showPhase("phase-employer");
});

document.getElementById("btn-employer-back").addEventListener("click", () => {
  showPhase("phase-listings");
});

const techSelect = document.getElementById("employer-tech");
TECH_JOBS.forEach((job, i) => {
  techSelect.insertAdjacentHTML("beforeend", `<option value="${i}">${job.role}</option>`);
});

document.getElementById("employer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  employer.job = TECH_JOBS[Number(techSelect.value)];
  employer.company = document.getElementById("employer-company").value.trim() || "Şirketiniz";
  employer.queue = buildQueue(employer.job);
  employer.index = 0;
  employer.rejected = [];
  document.getElementById("posting-title").textContent = `${employer.job.role} · ${employer.company}`;
  showEmployerCard("employer-review-card");
  renderCandidate();
});

document.getElementById("btn-hire").addEventListener("click", () => {
  const btn = document.getElementById("btn-hire");
  btn.disabled = true;
  btn.textContent = "Kaydedilemedi";
  document.getElementById("hire-error").textContent =
    "Sistem hatası: olumlu değerlendirme kaydedilemedi. (Hata kodu: RED-100) Bu platformda yalnızca olumsuz sonuç girilebilmektedir. Anlayışınız için teşekkür ederiz.";
});

document.getElementById("btn-reject").addEventListener("click", () => {
  const panel = document.getElementById("reject-panel");
  panel.hidden = false;
  const list = document.getElementById("reason-list");
  list.innerHTML = REJECT_REASONS.map(
    (r) => `<button type="button" class="reason-chip">${r}</button>`
  ).join("");
  list.querySelectorAll(".reason-chip").forEach((chip) =>
    chip.addEventListener("click", () => revealCandidate(chip.textContent))
  );
});

document.getElementById("btn-next").addEventListener("click", () => {
  employer.index += 1;
  if (employer.index < employer.queue.length) {
    renderCandidate();
    return;
  }
  renderEmployerSummary();
});

document.getElementById("btn-employer-again").addEventListener("click", () => {
  showEmployerCard("employer-form-card");
});

document.getElementById("btn-employer-home").addEventListener("click", () => {
  showPhase("phase-listings");
});
