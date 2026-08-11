import { COMPANY, HR_NAME } from "./config.js";

const QUESTIONS = [
  "Hoş geldiniz. İlk sorum şu: kendinizi bir ofis eşyası olarak tanımlasaydınız hangi eşya olurdunuz ve neden zımba değil?",
  "Hmm. İlginç bir bakış açısı. Peki 5 yıl sonra kendinizi nerede görüyorsunuz? Doğru cevabın 'burada, aynı maaşla' olduğunu hatırlatırım.",
  "Not aldım. Ekip çalışmasına ne kadar yatkınsınız? Örneğin hafta sonu mesaisine 'hayır' diyen bir ekip arkadaşınızı nasıl ikna edersiniz?",
  "Son sorum: maaş beklentiniz nedir? Yanıtlamadan önce yemek kartı politikamızı okumanızı öneririm.",
];

const APPEALS = [
  "İtirazınız alınmıştır. İtirazınız incelenmiştir. Kararımız korunmuştur. Bu yanıt otomatik olarak üretilmiştir.",
  "İtirazınızdaki argümanlar, red gerekçemizi güçlendirmiştir. Karar değişmemiştir. Bu yanıt otomatik olarak üretilmiştir.",
  "İtiraz hakkınızı kullandınız. Hakkınız burada bitmiştir. Kararımız kesindir. Bu yanıt otomatik olarak üretilmiştir.",
  "İtirazınız ilgili birime iletilmiştir. İlgili birim yoktur. Kararımız korunmuştur. Bu yanıt otomatik olarak üretilmiştir.",
];

const THERAPY = [
  "Anlattıklarınızı okudum ve gerçekten haklısınız. İnsanın emek verip karşılığında sessizlik alması yorucu bir şey.\n\nAncak süreçlerimiz yoğunluk nedeniyle her adaya dönüş yapamamaktadır. Anlayışınız için teşekkür ederiz.",
  "Bunu yaşadığınız için üzgünüm. Aylarca uğraşıp aynı cümleyi tekrar tekrar duymak kimsenin hak ettiği bir şey değil.\n\nBununla birlikte bu geri bildirim, standart geri bildirim politikamız gereği geri bildirim sayılmamaktadır.",
  "Söyledikleriniz çok tanıdık ve yalnız değilsiniz. Bu sürecin sizi yıpratması son derece normal.\n\nAncak yıpranma düzeyiniz pozisyonun gerektirdiği dayanıklılık profiliyle örtüşmemektedir.",
  "Sizi duyuyorum. Kendinizi kanıtlamak zorunda hissettiğiniz her görüşme, biraz daha yorgun çıkmanıza sebep oluyor olmalı.\n\nBununla birlikte kendinizi kanıtlama çabanız, henüz kanıtlanmamış olduğunuzu göstermektedir.",
  "Bu gerçekten haksızlık ve öyle hissetmenizde şaşılacak bir şey yok. Emeğinizin görülmemesi can sıkıcı.\n\nAncak görünürlük adayın sorumluluğundadır. Konuyla ilgili ücretli bir eğitimimiz bulunmaktadır.",
];

export function mockInterviewer(history, mode, name) {
  if (mode === "therapy") {
    const turns = history.filter((m) => m.role === "user").length;
    return { type: "therapy", text: THERAPY[(turns - 1 + THERAPY.length) % THERAPY.length] };
  }
  if (mode === "appeal") {
    const appeals = history.filter((m) => m.role === "user").length;
    return { type: "appeal", text: APPEALS[appeals % APPEALS.length] };
  }
  if (mode === "final") {
    return {
      type: "rejection",
      text: `Sayın ${name || "Aday"},\n\n1.247 başvuru arasından titizlikle değerlendirildiniz. Mülakat sürecindeki samimi yanıtlarınız için teşekkür ederiz. Maalesef, ofis eşyası sorusuna verdiğiniz yanıt ekibimizin delgeç odaklı vizyonuyla örtüşmediğinden sürece sizinle devam edemiyoruz.\n\nCV'niz yetenek havuzumuzda saklanacaktır. (Havuzumuz yoktur.)\n\nSaygılarımızla,\n${HR_NAME} — Kıdemli İK İş Ortağı\n${COMPANY}`,
    };
  }
  const userTurns = history.filter((m) => m.role === "user").length;
  const index = Math.min(Math.max(userTurns - 1, 0), QUESTIONS.length - 1);
  return { type: "question", text: QUESTIONS[index] };
}
