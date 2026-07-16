# Atanova — Yayına Alma Rehberi

Bu klasör, Claude'da hazırlanan Atanova (KPSS hazırlık) sitesinin gerçek bir
web sitesi olarak çalışacak halidir. Aşağıdaki adımları sırayla takip et.

## ÖNEMLİ: Depolama hakkında

Site şu an **tarayıcı içi (localStorage)** depolama kullanıyor. Yani:

- Senin eklediğin haberler/dersler SENİN tarayıcında görünür.
- Başka bir ziyaretçi siteyi açtığında SENİN eklediklerini GÖRMEZ.

Herkesin aynı haberleri görmesi için gerçek bir veritabanı (ör. Supabase)
gerekir. Bu rehberin sonunda "Sırada ne var" bölümünde bunu nasıl
ekleyeceğimizi anlatıyorum — ama önce siteyi yayına almak daha öncelikli.

---

## 1. Adım — Bilgisayarında test et (isteğe bağlı ama önerilir)

1. [Node.js](https://nodejs.org) kurulu değilse indir ve kur (LTS sürüm).
2. Bu klasörü bilgisayarına indir/kopyala.
3. Terminal aç, klasöre gir:
   ```
   cd kpss-site
   npm install
   npm run dev
   ```
4. Terminalde çıkan `http://localhost:5173` adresini tarayıcıda aç. Site
   çalışıyor olmalı.

## 2. Adım — GitHub'a yükle

1. [github.com](https://github.com) üzerinde ücretsiz bir hesap aç (yoksa).
2. Sağ üstten "New repository" ile yeni bir depo oluştur, adını
   `kpss-hazirlik` koyabilirsin. "Public" veya "Private" fark etmez.
3. Terminalde proje klasöründe:
   ```
   git init
   git add .
   git commit -m "ilk surum"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADIN/kpss-hazirlik.git
   git push -u origin main
   ```
   (`KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz.)

## 3. Adım — Vercel ile yayınla (ücretsiz)

1. [vercel.com](https://vercel.com) adresine git, "Continue with GitHub" ile
   giriş yap.
2. "Add New… → Project" de.
3. Az önce yüklediğin `kpss-hazirlik` deposunu seç, "Import" de.
4. Vercel, Vite projesini otomatik tanır. Ayar değiştirmene gerek yok.
5. "Deploy" butonuna bas. 1-2 dakika içinde siten
   `https://kpss-hazirlik-xxxx.vercel.app` gibi bir adreste yayında olacak.

## 4. Adım — Kendi alan adını bağla (isteğe bağlı)

1. Bir alan adı satın al (Türkiye'de örn. isimtescil.com, natro.com; ya da
   uluslararası Namecheap, Google Domains).
2. Vercel projende "Settings → Domains" bölümüne git, satın aldığın alan
   adını yaz.
3. Vercel sana birkaç DNS kaydı verecek (genelde bir A kaydı ve/veya CNAME).
   Bu kayıtları alan adını satın aldığın firmanın DNS panelinden ekle.
4. 10 dakika - birkaç saat içinde alan adın siteyi gösterir.

## 5. Adım — Reklam ağına başvur

1. Site birkaç gündür yayında ve birkaç yazı/içerik varken
   [Google AdSense](https://adsense.google.com)'e başvur.
2. Onay sürecinde site içeriğinin (yazılar, dersler) dolu olması ve
   birkaç haftalık gerçek ziyaretçi trafiği olması onay şansını artırır.
3. Onaylandığında sana verilen kodu `src/App.jsx` içindeki `AdSlot`
   bileşeninin içine yerleştir (o an tekrar yardımcı olabilirim).

---

## 6. Adım — SEO temellerini tamamla (yapıldı, senin yapman gereken tek şey)

`index.html`, `public/robots.txt` ve `public/sitemap.xml` dosyalarında
`SITEADRESIN.com` yazan yerleri gerçek alan adınla (ya da henüz alan adın
yoksa `kpss-hazirlik-xxxx.vercel.app` adresinle) değiştir. Ayrıca
`public/og-kapak.png` adında 1200×630 boyutunda bir kapak görseli eklersen,
sitenin linki sosyal medyada paylaşılınca güzel bir önizleme kartıyla
görünür (bu görseli istersen birlikte tasarlayabiliriz).

## 7. Adım — Google Search Console'a kaydol (ücretsiz)

1. [search.google.com/search-console](https://search.google.com/search-console)
   adresine git, Google hesabınla giriş yap.
2. "URL prefix" seçeneğine sitenin tam adresini yaz (ör.
   `https://kpss-hazirlik-xxxx.vercel.app`).
3. Sahiplik doğrulama için "HTML tag" yöntemini seç, sana verilen
   `<meta name="google-site-verification" ...>` etiketini kopyala.
4. Bu etiketi `index.html` dosyasının `<head>` kısmına ekle (ben yardımcı
   olurum), GitHub'a gönder, Vercel yeniden yayınlasın, sonra Search
   Console'da "Verify" de.
5. Doğrulandıktan sonra "Sitemaps" bölümüne `sitemap.xml` yaz ve gönder.

## 8. Adım — Google Analytics ekle (ücretsiz)

1. [analytics.google.com](https://analytics.google.com) adresinde ücretsiz
   bir hesap ve "web" özelliği (property) oluştur.
2. Sana bir "Measurement ID" (G-XXXXXXX gibi) ve bir kod parçası verilecek.
3. Bu kodu `index.html`'e eklememiz yeterli — istediğinde bu kodu bana
   yapıştır, yerleştireyim.

## 9. Adım — Düzenli içerik ve ücretsiz tanıtım

- Haftada birkaç kez "Yeni Yazı" veya "Ders Ekle" ile gerçek içerik ekle.
  Hedef: 15-20 yazı/ders ve düzenli güncelleme geçmişi.
- Siteyi KPSS topluluklarında (Instagram, Telegram/WhatsApp grupları,
  Reddit, Facebook grupları) paylaş. Bu tamamen ücretsizdir ve ilk
  ziyaretçilerini buradan alırsın.

## 10. Adım — Google AdSense'e başvur

Site birkaç haftadır yayında, dolu içerikli ve gerçek ziyaretçisi varken
[adsense.google.com](https://adsense.google.com) üzerinden başvur.
Onaylandığında sana verilen kodu `src/App.jsx` içindeki `AdSlot`
bileşenine yerleştiririz — o zaman reklam geliri gerçekten akmaya başlar.

---

## Sırada ne var (opsiyonel geliştirme)

Şu an haberler/dersler sadece ekleyen kişinin tarayıcısında görünüyor.
Herkesin aynı içeriği görmesi için:

1. Ücretsiz bir [Supabase](https://supabase.com) hesabı/projesi aç.
2. `articles` ve `topics` adında iki tablo oluştur.
3. `src/storagePolyfill.js` dosyasındaki localStorage çağrılarını
   Supabase istemcisiyle değiştiririz.

Bu adımı istediğinde birlikte yapabiliriz — şu an için siteyi önce
yayına almak daha öncelikli.
