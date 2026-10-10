const COMPANY_PROFILES = {
  "Vizyoner Global Teknoloji A.Ş.": {
    rating: 1.2,
    reviews: 3847,
    recommend: 4,
    ceoApproval: 8,
    industry: "Bilgi Teknolojileri · 500-1000 çalışan · Plaza 4. Kat",
    breakdown: [2, 3, 5, 12, 78],
    comments: [
      {
        stars: 1,
        title: "Dinamik startup kültürü (kaos)",
        role: "Eski Çalışan · Yazılım Geliştirici",
        pros: "Yemek kartı bazı aylar yatıyor.",
        cons: "Diğer her şey. Hibrit dediler, haftada 6 gün ofis çıktı.",
        advice: "Haftayı 7 güne çıkarın, hiç değilse tutarlı olun.",
      },
      {
        stars: 1,
        title: "Aile ortamı var, maaş yok",
        role: "Eski Stajyer",
        pros: "Sınırsız çay (poşet).",
        cons: "6 ay ücretsiz çalıştım, sonunda 'aileden biri' oldum. Aile bana maaş vermiyor.",
        advice: "Aidiyet market fişi olarak kabul edilmiyor.",
      },
      {
        stars: 5,
        title: "Harika bir şirket, çok mutluyum!",
        role: "Mevcut Çalışan · Belirtilmemiş",
        pros: "Vizyoner liderlik, güçlü kültür, büyüme fırsatları.",
        cons: "Aklıma gelmiyor.",
        advice: "Böyle devam. (Bu yorum İnsan Kaynakları tarafından yazılmamıştır.)",
      },
    ],
  },
  "Halden Anlar Holding": {
    rating: 1.4,
    reviews: 1129,
    recommend: 6,
    ceoApproval: 11,
    industry: "Holding · 2000+ çalışan · Merkez Ofis",
    breakdown: [3, 4, 6, 15, 72],
    comments: [
      {
        stars: 1,
        title: "Küçülen aile",
        role: "Eski Çalışan · Uzman",
        pros: "Ayrılırken kimse zorluk çıkarmadı.",
        cons: "Ekibin %40'ı bir haftada gitti. LinkedIn'de buna 'çeviklik' dediler.",
        advice: "Referans veremiyorsanız en azından bunu ilanda yazın.",
      },
      {
        stars: 2,
        title: "Bodrum katta 3 yıl",
        role: "Mevcut Çalışan · IT Sorumlusu",
        pros: "Sunucu odasının klimasından faydalanabiliyorum.",
        cons: "Pencere var ama açılmıyor. Ben de açılmıyorum artık.",
        advice: "Yazıcıyı değiştirin.",
      },
    ],
  },
  "SinerjiSoft (Vizyoner Global iştiraki)": {
    rating: 1.6,
    reviews: 612,
    recommend: 9,
    ceoApproval: 14,
    industry: "Yazılım · 50-200 çalışan · Yoğurtçu durağına 45 dk",
    breakdown: [4, 6, 8, 18, 64],
    comments: [
      {
        stars: 2,
        title: "AI Lead ünvanı aldım (kartvizitte)",
        role: "Mevcut Çalışan · Yapay Zeka Uzmanı",
        pros: "Ünvan LinkedIn'de gerçekten iyi duruyor.",
        cons: "Geleceğin teknolojisi Excel'miş. Ayrıca fotokopi makinesine de ben bakıyorum.",
        advice: "GPU'yu komşu şirketten rica etmeyi bırakın.",
      },
    ],
  },
  "GüvenBank Dijital": {
    rating: 1.1,
    reviews: 2204,
    recommend: 3,
    ceoApproval: 5,
    industry: "Finans · 1000+ çalışan · Uzaktan",
    breakdown: [1, 2, 4, 9, 84],
    comments: [
      {
        stars: 1,
        title: "Geçen haftaki olayı sormayın dediler",
        role: "Eski Çalışan · Siber Güvenlik",
        pros: "7/24 adrenalin gerçekten var.",
        cons: "Güvenlik bütçesi her yıl 'gelecek yıl'. Şifre hâlâ 123456.",
        advice: "Penetrasyon testi hayal gücüyle yapılmıyor.",
      },
      {
        stars: 1,
        title: "Günde 140 çağrı",
        role: "Mevcut Çalışan · Müşteri Temsilcisi",
        pros: "Kulaklık veriliyor (ortak kullanım).",
        cons: "Tuvalet molası 4 dakika. Psikolojik destek hattı sürekli meşgul.",
        advice: "Destek hattına bir kişi daha alın. Ya da hiç olmasın, en azından dürüst olur.",
      },
    ],
  },
  "AppKardeşler Yazılım": {
    rating: 1.8,
    reviews: 388,
    recommend: 12,
    ceoApproval: 19,
    industry: "Mobil Yazılım · 10-50 çalışan · Ofis içi",
    breakdown: [5, 7, 11, 21, 56],
    comments: [
      {
        stars: 2,
        title: "Fikir cuma akşamı gelir",
        role: "Eski Çalışan · Mobil Geliştirici",
        pros: "Test cihazı sorunu yok, kendi telefonunuzu kullanıyorsunuz.",
        cons: "'WhatsApp gibi ama farklı' brief'i ile hafta sonu uygulama yazdım. Prim 2019'dan beri çıkmadı.",
        advice: "Developer hesabı ücretini maaştan kesmeyin.",
      },
    ],
  },
  "Disruptif Teknoloji ve Vizyon A.Ş.": {
    rating: 1.5,
    reviews: 501,
    recommend: 7,
    ceoApproval: 10,
    industry: "Teknoloji · 10-50 çalışan · Garaj Ofis",
    breakdown: [3, 5, 9, 19, 64],
    comments: [
      {
        stars: 1,
        title: "Ninja, rockstar, guru — üçü de ben",
        role: "Eski Çalışan · Full-Stack",
        pros: "Masa tenisi masası var (toplantı masası olarak kullanılıyor).",
        cons: "10x developer arıyorlar, 1x maaş veriyorlar. Pizza ayda bir, tek dilim.",
        advice: "Bean bag bel sağlığı değildir.",
      },
      {
        stars: 2,
        title: "Sıfır bütçeyle büyüme bekleniyor",
        role: "Mevcut Çalışan · Growth",
        pros: "Tam yetki verdiler (bütçe hariç).",
        cons: "Viral olmayı takvimlendirmemi istediler. Hangi gün viral olacağımızı soruyorlar.",
        advice: "Veriye dayalı karar için önce veri lazım.",
      },
    ],
  },
};

const BUKET_PROFILE = {
  name: "Buket K.",
  title: "Kıdemli İnsan Kaynakları İş Ortağı",
  company: "Vizyoner Global Teknoloji A.Ş.",
  meta: "İstanbul · 12.482 bağlantı · Aynı pozisyonda 13 yıl",
  about:
    "İnsan odaklı bir İK yaklaşımı benimsiyorum. Her adayın hikâyesi değerlidir ve her hikâye bir yerde biter. Kariyerim boyunca 84.000'den fazla adayla temas kurdum, hiçbirini işe almadım. Tutarlılık benim için bir değerdir.",
  experience: [
    { role: "Kıdemli İK İş Ortağı", org: "Vizyoner Global Teknoloji A.Ş.", time: "2013 — halen · 13 yıl" },
    { role: "İK Uzmanı", org: "Vizyoner Global Teknoloji A.Ş.", time: "2011 — 2013 · 2 yıl" },
    { role: "İK Asistanı", org: "Vizyoner Global Teknoloji A.Ş.", time: "2010 — 2011 · 1 yıl" },
  ],
  skills: [
    { name: "Olumsuz Geri Bildirim", count: 847 },
    { name: "Kurumsal Nezaket", count: 612 },
    { name: "Pasif Agresif İletişim", count: 588 },
    { name: "Yetenek Havuzu Yönetimi", count: 3 },
    { name: "Aday Deneyimi", count: 0 },
  ],
  awards: [
    "Ayın İK Uzmanı — Mart 2019",
    "En Hızlı Red Süresi Ödülü — 2021 (2 dk 04 sn)",
    "Sıfır İşe Alım Rozeti — 13 yıl kesintisiz",
  ],
};

function stars(rating) {
  const full = Math.round(rating);
  return `<span class="stars" aria-label="${rating} / 5">${"★".repeat(full)}${"☆".repeat(5 - full)}</span>`;
}

function openCompany(companyName) {
  const profile = COMPANY_PROFILES[companyName];
  if (!profile) return;
  document.getElementById("company-name").textContent = companyName;
  document.getElementById("company-industry").textContent = profile.industry;
  document.getElementById("company-rating").innerHTML =
    `<strong>${profile.rating.toFixed(1)}</strong> ${stars(profile.rating)}
     <span class="muted small">${profile.reviews.toLocaleString("tr-TR")} değerlendirme</span>`;
  document.getElementById("company-recommend").innerHTML =
    `<div><strong>%${profile.recommend}</strong><span>arkadaşına tavsiye eder</span></div>
     <div><strong>%${profile.ceoApproval}</strong><span>CEO'yu onaylıyor</span></div>`;
  document.getElementById("company-breakdown").innerHTML = profile.breakdown
    .map((pct, i) => {
      const star = 5 - i;
      return `<div class="bar-row"><span>${star}★</span><div class="bar"><i style="width:${pct}%"></i></div><span class="bar-pct">%${pct}</span></div>`;
    })
    .join("");
  document.getElementById("company-comments").innerHTML = profile.comments
    .map(
      (c) => `
      <article class="review">
        <h4>${stars(c.stars)} ${esc(c.title)}</h4>
        <p class="muted small">${esc(c.role)}</p>
        <p><strong>Artılar:</strong> ${esc(c.pros)}</p>
        <p><strong>Eksiler:</strong> ${esc(c.cons)}</p>
        <p class="muted small"><strong>Yönetime tavsiye:</strong> ${esc(c.advice)}</p>
      </article>`
    )
    .join("");
  showPhase("phase-company");
}

function openBuket() {
  const p = BUKET_PROFILE;
  document.getElementById("person-name").textContent = p.name;
  document.getElementById("person-title").textContent = p.title;
  document.getElementById("person-meta").textContent = p.meta;
  document.getElementById("person-about").textContent = p.about;
  document.getElementById("person-experience").innerHTML = p.experience
    .map((e) => `<li><strong>${esc(e.role)}</strong><span>${esc(e.org)}</span><span class="muted small">${esc(e.time)}</span></li>`)
    .join("");
  document.getElementById("person-skills").innerHTML = p.skills
    .map((s) => `<li><span>${esc(s.name)}</span><span class="skill-count">${s.count} onay</span></li>`)
    .join("");
  document.getElementById("person-awards").innerHTML = p.awards
    .map((a) => `<li>${esc(a)}</li>`)
    .join("");
  showPhase("phase-person");
}

document.getElementById("detail-company").addEventListener("click", () => {
  openCompany(state.listing?.company);
});

document.getElementById("interview-buket").addEventListener("click", openBuket);

document.querySelectorAll(".btn-profile-back").forEach((btn) =>
  btn.addEventListener("click", () => showPhase("phase-listings"))
);

document.getElementById("btn-person-connect").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = "İstek gönderildi";
  setTimeout(() => {
    btn.textContent = "İstek beklemede (14 ay)";
  }, 2000);
});
