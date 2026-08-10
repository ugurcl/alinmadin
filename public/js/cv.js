const CV_STEPS = [
  [0, "CV'niz yükleniyor..."],
  [900, "Metin çıkarılıyor..."],
  [1700, "Deneyim bilgileri ayrıştırılıyor..."],
  [2500, "Yetkinlikler eşleştiriliyor..."],
  [3300, "Analiz tamamlanıyor..."],
];

const cvInput = document.getElementById("input-cv");
const cvProgress = document.getElementById("cv-progress");
const cvStatus = document.getElementById("cv-status");
const cvFill = document.getElementById("cv-fill");
const cvDone = document.getElementById("cv-done");
const cvExtra = document.getElementById("cv-extra");

const birthSelect = document.getElementById("input-birth");
for (let year = 2010; year >= 1950; year--) {
  birthSelect.insertAdjacentHTML("beforeend", `<option>${year}</option>`);
}

cvInput.addEventListener("change", () => {
  const file = cvInput.files?.[0];
  if (!file) return;
  cvInput.disabled = true;
  cvDone.hidden = true;
  cvProgress.hidden = false;
  cvFill.style.width = "0%";

  CV_STEPS.forEach(([delay, label], i) => {
    setTimeout(() => {
      cvStatus.textContent = label;
      cvFill.style.width = `${((i + 1) / CV_STEPS.length) * 100}%`;
    }, delay);
  });

  setTimeout(() => {
    cvProgress.hidden = true;
    cvDone.hidden = false;
    cvDone.textContent = `${file.name} başarıyla alındı. Lütfen aşağıdaki alanları doldurunuz.`;
    cvExtra.hidden = false;
    document.getElementById("input-name").focus();
  }, 4100);
});
