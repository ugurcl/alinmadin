import { COMPANY, HR_NAME } from "./config.js";

const QUESTIONS = [
  "Hoş geldiniz. İlk sorum şu: kendinizi bir ofis eşyası olarak tanımlasaydınız hangi eşya olurdunuz ve neden zımba değil?",
  "Hmm. İlginç bir bakış açısı. Peki 5 yıl sonra kendinizi nerede görüyorsunuz? Doğru cevabın 'burada, aynı maaşla' olduğunu hatırlatırım.",
  "Not aldım. Ekip çalışmasına ne kadar yatkınsınız? Örneğin hafta sonu mesaisine 'hayır' diyen bir ekip arkadaşınızı nasıl ikna edersiniz?",
  "Son sorum: maaş beklentiniz nedir? Yanıtlamadan önce yemek kartı politikamızı okumanızı öneririm.",
];

export function mockInterviewer(history, isFinal, name) {
  if (isFinal) {
    return {
      type: "rejection",
      text: `Sayın ${name || "Aday"},\n\n1.247 başvuru arasından titizlikle değerlendirildiniz. Mülakat sürecindeki samimi yanıtlarınız için teşekkür ederiz. Maalesef, ofis eşyası sorusuna verdiğiniz yanıt ekibimizin delgeç odaklı vizyonuyla örtüşmediğinden sürece sizinle devam edemiyoruz.\n\nCV'niz yetenek havuzumuzda saklanacaktır. (Havuzumuz yoktur.)\n\nSaygılarımızla,\n${HR_NAME} — Kıdemli İK İş Ortağı\n${COMPANY}`,
    };
  }
  const userTurns = history.filter((m) => m.role === "user").length;
  const index = Math.min(Math.max(userTurns - 1, 0), QUESTIONS.length - 1);
  return { type: "question", text: QUESTIONS[index] };
}
