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

function fitFontSize(ctx, text, baseSize, maxWidth, minSize, family) {
  let size = baseSize;
  while (size > minSize) {
    ctx.font = `bold ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function drawCenteredWrapped(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapText(ctx, text, maxWidth);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function renderCertificate(name, position, letter, company) {
  const canvas = document.getElementById("certificate");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const maxW = W - 220;

  ctx.fillStyle = "#fbfaf7";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#1a2942";
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  const companyText = (company || "Vizyoner Global Teknoloji A.Ş.").toLocaleUpperCase("tr-TR");
  ctx.fillStyle = "#1a2942";
  ctx.textAlign = "center";
  const headerSize = fitFontSize(ctx, companyText, 40, maxW, 24, "Georgia");
  ctx.font = `bold ${headerSize}px Georgia`;
  ctx.fillText(companyText, W / 2, 150);

  ctx.font = "28px Georgia";
  ctx.fillStyle = "#6b7684";
  ctx.fillText("İnsan Kaynakları Direktörlüğü", W / 2, 195);

  ctx.fillStyle = "#c0392b";
  ctx.font = "bold 72px Georgia";
  ctx.fillText("RED BELGESİ", W / 2, 310);

  ctx.fillStyle = "#22303f";
  ctx.font = "30px Georgia";
  let y = 400;
  y = drawCenteredWrapped(ctx, `İşbu belge, sayın ${name || "Aday"}'ın`, W / 2, y, maxW, 42);
  y = drawCenteredWrapped(ctx, `"${position}" pozisyonuna`, W / 2, y, maxW, 42);
  y = drawCenteredWrapped(ctx, "KESİNLİKLE UYGUN OLMADIĞINI onaylar.", W / 2, y, maxW, 42);
  y += 30;

  ctx.textAlign = "left";
  ctx.font = "26px Georgia";
  const bottomLimit = H - 250;
  const lineHeight = 38;
  let truncated = false;
  outer: for (const para of letter.split("\n")) {
    if (!para.trim()) {
      y += 14;
      continue;
    }
    for (const line of wrapText(ctx, para, maxW)) {
      if (y + lineHeight > bottomLimit) {
        truncated = true;
        break outer;
      }
      ctx.fillText(line, 110, y);
      y += lineHeight;
    }
    y += 10;
  }
  if (truncated) {
    ctx.fillText("...", 110, Math.min(y, bottomLimit));
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
