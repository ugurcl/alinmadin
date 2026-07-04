function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function renderCertificate(name, position, letter) {
  const canvas = document.getElementById("certificate");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = "#fbfaf7";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#1a2942";
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  ctx.fillStyle = "#1a2942";
  ctx.textAlign = "center";
  ctx.font = "bold 44px Georgia";
  ctx.fillText("VİZYONER GLOBAL TEKNOLOJİ A.Ş.", W / 2, 150);
  ctx.font = "28px Georgia";
  ctx.fillStyle = "#6b7684";
  ctx.fillText("İnsan Kaynakları Direktörlüğü", W / 2, 195);

  ctx.fillStyle = "#c0392b";
  ctx.font = "bold 72px Georgia";
  ctx.fillText("RED BELGESİ", W / 2, 310);

  ctx.fillStyle = "#22303f";
  ctx.font = "30px Georgia";
  ctx.fillText(`İşbu belge, sayın ${name || "Aday"}'ın`, W / 2, 400);
  ctx.fillText(`"${position}" pozisyonuna`, W / 2, 445);
  ctx.fillText("KESİNLİKLE UYGUN OLMADIĞINI onaylar.", W / 2, 490);

  ctx.textAlign = "left";
  ctx.font = "26px Georgia";
  const excerpt = letter.length > 420 ? letter.slice(0, 420) + "..." : letter;
  let y = 570;
  for (const para of excerpt.split("\n")) {
    for (const line of wrapText(ctx, para, W - 220)) {
      ctx.fillText(line, 110, y);
      y += 38;
      if (y > H - 260) break;
    }
    y += 12;
    if (y > H - 260) break;
  }

  ctx.save();
  ctx.translate(W - 260, H - 300);
  ctx.rotate(0.2);
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 8;
  ctx.strokeRect(-110, -50, 220, 100);
  ctx.fillStyle = "#c0392b";
  ctx.textAlign = "center";
  ctx.font = "bold 56px Georgia";
  ctx.fillText("RED", 0, 20);
  ctx.restore();

  ctx.fillStyle = "#6b7684";
  ctx.textAlign = "center";
  ctx.font = "24px Georgia";
  const date = new Date().toLocaleDateString("tr-TR");
  ctx.fillText(`Tarih: ${date} · Başvuru No: ${Math.floor(Math.random() * 9000) + 1000}`, W / 2, H - 160);
  ctx.font = "italic 22px Georgia";
  ctx.fillText("Bu belge hiçbir kurumda geçerli değildir. Tıpkı verilen sözler gibi.", W / 2, H - 115);
}

function downloadCertificate() {
  const canvas = document.getElementById("certificate");
  const link = document.createElement("a");
  link.download = "red-belgesi.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
