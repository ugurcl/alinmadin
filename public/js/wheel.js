const WHEEL_OPENERS = [
  "Değerlendirmemiz sonucunda",
  "Titiz bir inceleme sonrasında",
  "Ekibimizle yaptığımız istişare neticesinde",
  "Yetenek kazanımı süreçlerimiz kapsamında",
  "Üst yönetimin de görüşü alınarak",
  "Uzun bir kalibrasyon toplantısının ardından",
  "Aday havuzumuzun genel görünümü dikkate alınarak",
];

const WHEEL_REASONS = [
  "CV'nizdeki yazı tipinin kurumsal enerjimizi taşımadığı",
  "mülakat sırasında fazla hazırlıklı görünmenizin doğallığı gölgelediği",
  "deneyiminizin pozisyona fazla uygun olması sebebiyle sıkılabileceğiniz",
  "e-posta adresinizdeki rakamların bir anlam ifade etmediği",
  "profil fotoğrafınızda arka planda görünen bitkinin bakımsız olduğu",
  "sorularımıza verdiğiniz cevapların sorularımızdan uzun olduğu",
  "kendinizi bir hayvana benzetememenizin takım ruhuna işaret etmediği",
  "maaş beklentinizi söylerken göz temasını fazla koruduğunuz",
  "LinkedIn profilinizde son 4 ayda hiçbir gönderiyi beğenmediğiniz",
  "referansınızın telefonu ilk çalışta açmasının şüphe uyandırdığı",
  "mülakata tam saatinde gelmenizin esnekliğe kapalılık olarak yorumlandığı",
  "\"kendimi geliştirmek istiyorum\" cümlesini kurmanızın mevcut halinizi yetersiz gösterdiği",
  "5 yıl sonrası planınızın bizim 3 yıllık planımızı aşması",
  "hafta sonu çalışma sorusuna verdiğiniz duraksamanın kayda geçtiği",
  "teknik testte doğru cevabı fazla hızlı bulmanızın soruyu önceden bilmiş olabileceğinizi düşündürdüğü",
  "önceki işinizden ayrılma sebebinizin fazla makul olduğu",
  "portfolyonuzdaki projelerin gerçekten çalışıyor olmasının beklentimizi yükselttiği",
  "ekip çalışması örneğinizde ekibin başarılı olmasının bireysel katkınızı belirsizleştirdiği",
  "\"neden biz\" sorusuna verdiğiniz cevapta şirket adımızı doğru telaffuz ettiğiniz",
  "sertifikalarınızın geçerlilik süresinin dolmasına daha çok olduğu",
  "adınızın bölümdeki bir başka çalışanla aynı olması ve karışıklık istemediğimiz",
  "mülakatın son 30 saniyesinde sorduğunuz sorunun bizi düşündürdüğü",
  "video mülakatta internetinizin hiç donmamasının sizi fazla ayrıcalıklı gösterdiği",
  "özgeçmişinizde boşluk olmamasının dinlenmeye ihtiyaç duymadığınızı düşündürdüğü",
  "hobilerinizin işle ilgisiz olması ve odaklanma sorununa işaret ettiği",
];

const WHEEL_TWISTS = [
  "sürecinize burada son verilmiştir.",
  "başvurunuz olumsuz sonuçlanmıştır.",
  "sizinle devam etmeme kararı alınmıştır.",
  "pozisyon için farklı bir profille ilerlenmiştir.",
  "başvurunuz havuza taşınmıştır. Havuz kapalıdır.",
  "değerlendirme dosyanız kapatılmıştır.",
  "sürecin bu aşamasında yollarımızı ayırıyoruz.",
];

const WHEEL_STINGS = [
  "Kararımız kişisel değildir. Sizi tanımıyoruz.",
  "Bu gerekçe rastgele üretilmiştir. Gerçek olanlar da öyleydi.",
  "Geri bildirim talep etmenize gerek yoktur, bu oydu.",
  "İlan hâlâ yayında kalacaktır.",
  "Sizi bu süreçte tanımak güzeldi. Tanımadık ama güzeldi.",
  "Aynı ilana 3 ay sonra tekrar başvurabilirsiniz. Aynı sonucu alırsınız.",
  "Bu gerekçeyi kimse okumadı, siz dahil.",
];

const wheelSlot = document.getElementById("wheel-slot");
const wheelNote = document.getElementById("wheel-note");
const wheelCountEl = document.getElementById("wheel-count");
const spinBtn = document.getElementById("btn-spin");
const wheelCopyBtn = document.getElementById("btn-wheel-copy");
const wheelTweetBtn = document.getElementById("btn-wheel-tweet");

let wheelSpinning = false;
let wheelText = "";
let wheelSpins = Number(localStorage.getItem("redin_spins") || 0);

const wheelPick = (list) => list[Math.floor(Math.random() * list.length)];

function buildExcuse() {
  return `${wheelPick(WHEEL_OPENERS)}, ${wheelPick(WHEEL_REASONS)} görülmüş ve ${wheelPick(WHEEL_TWISTS)}`;
}

function renderWheelCount() {
  if (!wheelSpins) {
    wheelCountEl.textContent = "";
    return;
  }
  wheelCountEl.textContent =
    wheelSpins === 1
      ? "1 kez çevirdiniz. Bir kez reddedildiniz."
      : `${wheelSpins} kez çevirdiniz. ${wheelSpins} farklı gerekçeyle reddedildiniz.`;
}

function spinWheel() {
  if (wheelSpinning) return;
  wheelSpinning = true;
  spinBtn.disabled = true;
  spinBtn.textContent = "Çevriliyor...";
  wheelNote.textContent = "";
  wheelCopyBtn.hidden = true;
  wheelTweetBtn.hidden = true;
  wheelSlot.classList.add("spinning");
  wheelSlot.classList.remove("settled");

  const target = buildExcuse();
  let delay = 55;
  let ticks = 0;

  const tick = () => {
    if (ticks < 14) {
      wheelSlot.innerHTML = `<span class="wheel-blur">${esc(wheelPick(WHEEL_REASONS))}</span>`;
      ticks += 1;
      delay = ticks > 9 ? delay * 1.45 : delay;
      return setTimeout(tick, delay);
    }
    wheelText = target;
    wheelSlot.classList.remove("spinning");
    wheelSlot.classList.add("settled");
    wheelSlot.innerHTML = `<p class="wheel-text">${esc(target)}</p><p class="wheel-sting">${esc(wheelPick(WHEEL_STINGS))}</p>`;
    play("thud");
    wheelSpins += 1;
    localStorage.setItem("redin_spins", wheelSpins);
    renderWheelCount();
    spinBtn.disabled = false;
    spinBtn.textContent = "Bir Daha Çevir";
    wheelCopyBtn.hidden = false;
    wheelTweetBtn.hidden = false;
    wheelSpinning = false;
  };

  setTimeout(tick, 120);
}

spinBtn.addEventListener("click", spinWheel);

wheelCopyBtn.addEventListener("click", async () => {
  if (!wheelText) return;
  const ok = await copyText(`${wheelText}\n\nredin — işe alınmama simülatörü\n${location.origin}/cark`);
  wheelNote.textContent = ok ? "Kopyalandı. Kime göndereceğinizi biliyorsunuz." : "Kopyalanamadı. Bu da bir red sayılır.";
});

wheelTweetBtn.addEventListener("click", () => {
  if (!wheelText) return;
  const text = encodeURIComponent(`${wheelText}\n\n(bahane çarkı: ${location.origin}/cark)`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

function openWheel() {
  document.body.classList.remove("landing-open");
  if (location.pathname !== "/cark") history.pushState({}, "", "/cark");
  showPhase("phase-wheel");
  renderWheelCount();
}

document.getElementById("btn-open-wheel").addEventListener("click", openWheel);
