const RIVAL_NAMES = [
  "Berkay T.", "Cemre Y.", "Onur A.", "Melis K.", "Efe D.", "Sıla B.",
  "Kuzey Ö.", "Alp G.", "Derin S.", "Ege M.", "Naz P.", "Tuna V.",
];

const RIVAL_TITLES = [
  "Öğrenci · 2. sınıf",
  "Kariyer değişimi sürecinde",
  "3 haftalık bootcamp mezunu",
  "Serbest çalışan (henüz proje yok)",
  "Yeni mezun · staj yapmadı",
];

const RIVAL_ROWS = [
  {
    label: "Toplam deneyim",
    mine: () => {
      const years = Number(document.getElementById("input-years")?.value);
      return years > 0 ? `${years} yıl` : "Yıllardır";
    },
    theirs: () => ["0 yıl", "2 ay", "Staj (yarım bıraktı)", "Henüz başlamadı"],
  },
  {
    label: "Teknik test",
    mine: () => "Tamamlandı",
    theirs: () => ["Girmedi", "Yarıda bıraktı", "Test linkini açmadı", "Süre doldu"],
  },
  {
    label: "Mülakat notu",
    mine: () => "Sorulara cevap verdi",
    theirs: () => [
      "Kameradan katılmadı",
      "Mülakata 20 dk geç geldi",
      "Sorulardan birini anlamadı, geçildi",
      "Bir soruya 'bilmiyorum ama öğrenirim' dedi",
    ],
  },
  {
    label: "Teknoloji bilgisi",
    mine: () => {
      const stack = document.getElementById("input-stack")?.value?.trim();
      return stack ? stack.slice(0, 40) : "İlanda istenen her şey";
    },
    theirs: () => [
      "İlandakilerin adını duymuş",
      "YouTube'da izlemiş",
      "Yapay zekâya sormayı biliyor",
      "Öğrenmeye çok açık",
    ],
  },
  {
    label: "Referans kontrolü",
    mine: () => "Yapılmadı",
    theirs: () => [
      "Gerek görülmedi",
      "Zaten tanıyoruz",
      "Referansı bu görüşmede oturuyordu",
      "Referansı ilanı veren kişi",
    ],
  },
];

const RIVAL_REASONS = [
  "Kurucu ortağımızın kuzenidir.",
  "Genel müdürümüzle aynı liseden mezundur.",
  "İK direktörümüzün komşusunun oğludur.",
  "Şirket futbol takımında kaleci açığımız vardı.",
  "Maaş beklentisi yoktu. Gerçekten yoktu.",
  "Ekibimizin enerjisine daha uygun bulundu. Enerji ölçülmemiştir.",
  "Kültürel uyum sağladı. Kültürümüz kendisidir.",
  "Yönetim kurulu üyemizle aynı soyadını taşımaktadır. Tesadüftür.",
];

const RIVAL_FOOTERS = [
  "Bu karşılaştırma şeffaflık politikamız gereği paylaşılmıştır. Politikamız burada bitmektedir.",
  "İtiraz edebilirsiniz. Sonuç değişmez ama itiraz edebilirsiniz.",
  "Karşılaştırma otomatik üretilmiştir. Karar üretilmemiştir, çoktan verilmişti.",
  "Bu ekranı gördüğünüz için özür dileriz. Göstermek zorunda değildik.",
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function renderRival() {
  const box = document.getElementById("rival-box");
  if (!box) return;
  const name = pick(RIVAL_NAMES);
  const rows = RIVAL_ROWS.map(
    (row) => `
      <div class="rival-row">
        <span class="rival-label">${esc(row.label)}</span>
        <span class="rival-mine">${esc(row.mine())}</span>
        <span class="rival-theirs">${esc(pick(row.theirs()))}</span>
      </div>`
  ).join("");

  box.innerHTML = `
    <p class="rival-head">Sizinle birlikte değerlendirilen aday</p>
    <div class="rival-grid">
      <div class="rival-row rival-names">
        <span class="rival-label"></span>
        <span class="rival-mine"><strong>${esc(shortName(state.name || "Siz"))}</strong><br><span class="muted small">${esc(state.position || "Aday")}</span></span>
        <span class="rival-theirs rival-winner"><strong>${esc(name)}</strong><br><span class="muted small">${esc(pick(RIVAL_TITLES))}</span></span>
      </div>
      ${rows}
      <div class="rival-row rival-result">
        <span class="rival-label">Sonuç</span>
        <span class="rival-mine rival-no">Olumsuz</span>
        <span class="rival-theirs rival-yes">İşe alındı</span>
      </div>
    </div>
    <p class="rival-reason"><strong>Tercih gerekçesi:</strong> ${esc(pick(RIVAL_REASONS))}</p>
    <p class="rival-foot fineprint">${esc(pick(RIVAL_FOOTERS))}</p>`;

  box.hidden = false;
  requestAnimationFrame(() => box.classList.add("rival-in"));
}

function resetRival() {
  const box = document.getElementById("rival-box");
  if (!box) return;
  box.hidden = true;
  box.classList.remove("rival-in");
}
