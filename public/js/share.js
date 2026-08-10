const shareBtn = document.getElementById("btn-share");
const shareNote = document.getElementById("share-note");

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

shareBtn.addEventListener("click", async () => {
  if (state.shareUrl) {
    await copyText(state.shareUrl);
    shareNote.textContent = `Kopyalandı: ${state.shareUrl}`;
    return;
  }
  shareBtn.disabled = true;
  shareBtn.textContent = "Hazırlanıyor...";
  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
        position: state.position,
        company: state.listing?.company || "",
        letter: document.getElementById("rejection-text").textContent,
        seconds: state.durationSeconds || 0,
      }),
    });
    const data = await res.json();
    if (!data.id) throw new Error(data.error || "no id");
    state.shareUrl = `${location.origin}/r/${data.id}`;
    await copyText(state.shareUrl);
    shareNote.textContent = `Kopyalandı: ${state.shareUrl}`;
  } catch {
    shareNote.textContent = "Link oluşturulamadı. Bu da bir red sayılır.";
  }
  shareBtn.disabled = false;
  shareBtn.textContent = "Linki Kopyala";
});

async function loadSharedRejection() {
  const match = location.pathname.match(/^\/r\/([A-Za-z0-9]{1,12})$/);
  if (!match) return false;
  document.body.classList.remove("landing-open");
  try {
    const res = await fetch(`/api/share/${match[1]}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    document.getElementById("rejection-text").textContent = data.letter;
    document.getElementById("badge-earned").innerHTML =
      `<div class="badge-banner">Bu red <strong>${esc(data.name || "bir aday")}</strong> adına düzenlenmiştir. Siz sadece izliyorsunuz.</div>`;
    document.getElementById("duration-note").textContent = data.seconds
      ? `Değerlendirme süresi: ${formatDuration(data.seconds)}.`
      : "";
    renderCertificate(data.name, data.position, data.letter, data.company);
    document.getElementById("btn-share").hidden = true;
    document.querySelector(".appeal-zone").hidden = true;
    document.getElementById("btn-retry").textContent = "Sen de reddedil";
    showPhase("phase-rejection");
    const card = document.querySelector(".rejection");
    requestAnimationFrame(() => card.classList.add("slam"));
  } catch {
    document.getElementById("rejection-text").textContent =
      "Bu red kaydı bulunamadı. Silinmiş ya da hiç var olmamış olabilir. İkisi de bizim için aynı.";
    showPhase("phase-rejection");
  }
  return true;
}

loadSharedRejection();
