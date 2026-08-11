# Redin — İşe Alınmama Simülatörü

Başvur, mülakata gir, saçma bir sebeple reddedil. %100 red garantisi.

LinkedIn parodisi bir iş portalı: absürt ilanlar, yapay zekâ destekli İK uzmanı Buket ile mülakat, sonunda kişiye özel saçma gerekçeli resmi red mektubu ve indirilebilir "Red Belgesi".

## Bölümler

| Yol | Ne yapar |
| --- | --- |
| `/` | İlanlar, akış, mülakat ve red mektubu |
| `/duvar` | **Red Duvarı** — kullanıcıların gerçek hayatta duyduğu saçma red gerekçeleri, "ben de yedim" sayacıyla |
| `/cark` | **Bahane Çarkı** — mülakata girmeden tek tıkla üretilen red gerekçesi |
| `/terapi` | **Buket'e İçini Dök** — anlattığınızı önce anlayan, sonra kurumsal moda dönen destek hattı |
| `/r/<id>` | Paylaşılan red mektubu |

Red mektubunun ardından **rakip aday karşılaştırması** çıkar: her kalemde sizden kötü olan ama işi alan adayın kartı.

Red Duvarı kullanıcı içeriği barındırır; sunucu tarafında küfür/link filtresi, uzunluk sınırı, tekrar kontrolü ve IP başına gönderim limiti uygulanır (`src/wall.js`).

## Kurulum

```bash
git clone <repo>
cd alinmadin
cp .env.example .env
node server.js
```

`.env` içine bir veya birden fazla Gemini API anahtarı girin (virgülle ayırarak). Anahtarlar otomatik rotasyonla kullanılır, kota dolan anahtar devre dışı kalır:

```
GEMINI_API_KEYS=key1,key2
PORT=3210
```

Anahtar girilmezse site hazır senaryolu mock modda çalışır.

Bağımlılık yok, `npm install` gerekmez. Node.js 18+ yeterli.

## Not

Bu bir mizah projesidir. Gerçek bir şirket, gerçek bir ilan ve gerçek bir umut içermez.
