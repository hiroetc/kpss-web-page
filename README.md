# KPSS Hazırlık — Yayına Alma Rehberi

Bu klasör, Claude'da hazırlanan KPSS sitesinin gerçek bir web sitesi olarak
çalışacak halidir. Aşağıdaki adımları sırayla takip et.

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

## Sırada ne var (opsiyonel geliştirme)

Şu an haberler/dersler sadece ekleyen kişinin tarayıcısında görünüyor.
Herkesin aynı içeriği görmesi için:

1. Ücretsiz bir [Supabase](https://supabase.com) hesabı/projesi aç.
2. `articles` ve `topics` adında iki tablo oluştur.
3. `src/storagePolyfill.js` dosyasındaki localStorage çağrılarını
   Supabase istemcisiyle değiştiririz.

Bu adımı istediğinde birlikte yapabiliriz — şu an için siteyi önce
yayına almak daha öncelikli.
