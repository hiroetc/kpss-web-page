import { useState, useEffect, useCallback, useRef } from "react";
import { Home, BookOpen, PenLine, Clock, BarChart3, CheckCircle2, XCircle, RotateCcw, ChevronRight, ChevronLeft, Award, Search, Plus, Newspaper, X, Trash2 } from "lucide-react";

/* ------------------------------------------------------------------
   TASARIM SİSTEMİ
   Konu: KPSS sınav kültürü — optik cevap kağıdı, sınav giriş belgesi,
   kurşun kalemle işaretleme. Palet kağıt/kraft zemin + mürekkep lacivert
   + optik-kırmızı işaretleme rengi. Başlık: Bitter (resmi, ciddi slab-serif)
   Gövde: IBM Plex Sans. Rakamlar/sayaç: IBM Plex Mono.
   İmza öğesi: gerçek KPSS optik formu gibi yuvarlak A-E işaretleme baloncukları.
------------------------------------------------------------------- */

/* ------------------------------------------------------------------
   TASARIM SİSTEMİ (v3 — Editoryal / Ciddi Haber Sitesi)
   Referans: klasik gazete/dergi siteleri. Siyah-beyaz temel + tek
   ölçülü vurgu rengi (kobalt mavi). Keskin/az yuvarlatılmış köşeler,
   ince ayraç çizgileri, büyük serif başlıklar, küçük harfli takip
   aralıklı etiketler (eyebrow). Süs yok, hiyerarşi net.
   Başlık: Source Serif 4 (ciddi, okunabilir editoryal serif)
   Gövde: Inter. Meta/tarih/sayaç: IBM Plex Mono.
   İmza öğesi korunuyor: KPSS optik formu baloncukları.
------------------------------------------------------------------- */

const COLORS = {
  paper: "#FFFFFF",
  paperDark: "#F6F5F3",
  ink: "#121212",
  inkSoft: "#2A2A2A",
  pencil: "#66656A",
  rule: "#DEDCD8",
  optikRed: "#1B4DE4",
  primarySoft: "#EAF0FE",
  highlight: "#1B4DE4",
  highlightSoft: "#F5F5F3",
  sage: "#1E8E5A",
  sageBg: "#E6F5EC",
  redBg: "#FBEAE8",
  danger: "#C0392B",
  warning: "#B8860B",
};

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.font-display { font-family: 'Source Serif 4', serif; }
.font-body { font-family: 'Inter', sans-serif; }
.font-mono { font-family: 'IBM Plex Mono', monospace; }
`;

/* ------------------------------- VERİ ------------------------------- */

const TOPICS = [
  {
    id: "t1",
    category: "Türkçe",
    title: "Paragrafta Anlam ve Yapı",
    body: "Paragraf sorularında ilk adım paragrafın konusunu ve ana düşüncesini belirlemektir. Giriş cümlesi genellikle konuyu tanıtır, gelişme cümleleri örnek ve açıklamalarla konuyu derinleştirir, sonuç cümlesi ise yazarın vardığı yargıyı verir. 'Ancak', 'fakat', 'bununla birlikte' gibi bağlaçlar paragrafın akışında bir karşıtlık ya da yön değişikliğine işaret eder; bu bağlaçların geçtiği yerler soru köklerinde sıkça vurgulanır."
  },
  {
    id: "t2",
    category: "Matematik",
    title: "Sayı Basamakları",
    body: "Bir doğal sayının basamakları birler, onlar, yüzler şeklinde soldan sağa artan güçlerle ifade edilir. Örneğin üç basamaklı bir 'abc' sayısı 100a + 10b + c şeklinde yazılır. Basamak toplamı, rakamların yer değiştirmesi ve sayının belirli bir sayıya bölünebilme koşulları (3'e bölünme için basamak toplamının 3'e bölünmesi gibi) KPSS'de sık çıkan kalıplardır."
  },
  {
    id: "t3",
    category: "Tarih",
    title: "Kurtuluş Savaşı Cepheleri",
    body: "Kurtuluş Savaşı; Doğu Cephesi (Ermenilerle), Güney Cephesi (Fransızlarla, düzenli ordu görev almadı), Batı Cephesi (Yunanlılarla, I. İnönü, II. İnönü, Kütahya-Eskişehir, Sakarya ve Büyük Taarruz) olmak üzere üç ana cephede yürütülmüştür. Batı Cephesi'nde düzenli ordunun ilk resmi başarısı I. İnönü Muharebesi'dir; bu zafer sonrasında TBMM'ye yurt dışından ilk kez resmi bir heyet gönderilmiş ve İstiklal Marşı kabul edilmiştir."
  },
  {
    id: "t4",
    category: "Coğrafya",
    title: "Türkiye'nin İklim Tipleri",
    body: "Türkiye'de üç ana iklim tipi görülür: kıyılarda Karadeniz ikliminde her mevsim yağış, Akdeniz ikliminde yazlar sıcak-kurak kışlar ılık-yağışlı; iç kesimlerde ise karasal iklim egemendir, yazlar sıcak-kurak kışlar soğuk ve kar yağışlıdır. İç Anadolu ve Doğu Anadolu'da günlük ve yıllık sıcaklık farkının fazla olması karasal iklimin temel özelliğidir."
  },
  {
    id: "t5",
    category: "Vatandaşlık",
    title: "Anayasa'nın Temel İlkeleri",
    body: "1982 Anayasası'nın değiştirilemez ve değiştirilmesi teklif dahi edilemez ilk üç maddesi; devletin şeklinin Cumhuriyet olduğunu, Cumhuriyetin nitelikleri (insan haklarına saygılı, Atatürk milliyetçiliğine bağlı, demokratik, laik ve sosyal bir hukuk devleti) ile devletin bütünlüğünü, resmi dilini, bayrağını, milli marşını ve başkentini düzenler. Bu maddelerin değiştirilmesi teklifi bile yapılamaz."
  },
  {
    id: "t6",
    category: "Eğitim Bilimleri",
    title: "Öğrenme Kuramlarına Giriş",
    body: "Davranışçı kuramlar (Pavlov, Skinner) öğrenmeyi uyaran-tepki bağı olarak açıklarken; bilişsel kuramlar (Piaget, Bruner) zihinsel süreçlere, yapılandırmacılık ise öğrencinin bilgiyi kendi deneyimleriyle inşa etmesine odaklanır. KPSS Eğitim Bilimleri'nde bu kuramların temsilcileri ve temel kavramları (pekiştirme, şema, iskele/scaffolding gibi) birbirinden ayırt edilecek şekilde sorulur."
  },
];

const QUESTIONS = [
  // Türkçe
  { id: "q1", category: "Türkçe", q: "\"Bu şehirde yıllarca yaşamış olmasına rağmen sokaklarını hâlâ tam olarak tanımıyordu.\" cümlesinde vurgulanan durum aşağıdakilerden hangisidir?", options: ["Yaşanan sürenin uzunluğuna rağmen tam bir aşinalığın oluşmaması", "Şehrin çok büyük olması", "Kişinin sık seyahat etmesi", "Şehrin yeni kurulmuş olması", "Kişinin hafıza sorunları yaşaması"], correct: 0, explain: "\"Rağmen\" bağlacı, uzun süre yaşamasına karşın tanıdıklık oluşmadığını, yani beklenenin gerçekleşmediğini vurgular." },
  { id: "q2", category: "Türkçe", q: "Aşağıdaki cümlelerin hangisinde neden-sonuç ilişkisi vardır?", options: ["Sabah erken kalktı ve kahvaltısını yaptı.", "Yağmur yağdığı için maç ertelendi.", "Hem kitap okudu hem müzik dinledi.", "Ya tren ya da otobüsle gidecek.", "Kitabı okudu, sonra uyudu."], correct: 1, explain: "\"İçin\" bağlacı burada nedeni (yağmur) sonuca (maçın ertelenmesi) bağlar." },
  { id: "q3", category: "Türkçe", q: "\"Göz\" sözcüğü aşağıdaki cümlelerin hangisinde gerçek anlamının dışında kullanılmıştır?", options: ["Gözlerinin rengi kahverengiydi.", "Bu işin gözünü kim bilir kim çıkardı.", "Doktor gözlerini muayene etti.", "Gözüne bir şey kaçtı.", "Gözlük gözlerini yormuştu."], correct: 1, explain: "\"İşin gözünü çıkarmak\" bir işi çok fazla tekrarlayarak bıkkınlık yaratmak anlamında mecaz kullanımdır." },
  { id: "q4", category: "Türkçe", q: "Aşağıdakilerden hangisi bir öznel yargı cümlesidir?", options: ["Ankara, Türkiye'nin başkentidir.", "Bu roman, yazarın en güzel eseridir.", "Su, 100 derecede kaynar.", "Toplantı saat 10'da başladı.", "Kitap 300 sayfadan oluşuyor."], correct: 1, explain: "\"En güzel\" ifadesi kişisel beğeniye dayanır, kanıtlanabilir bir bilgi değildir; bu da cümleyi öznel yapar." },
  // Matematik
  { id: "q5", category: "Matematik", q: "Rakamları farklı üç basamaklı en küçük doğal sayı kaçtır?", options: ["100", "102", "120", "123", "111"], correct: 1, explain: "Yüzler basamağına en küçük rakam olan 1, onlar basamağına 0, birler basamağına ise 0'dan ve 1'den farklı en küçük rakam olan 2 yazılır: 102." },
  { id: "q6", category: "Matematik", q: "Bir sayının 3'e bölünebilmesi için hangi koşul sağlanmalıdır?", options: ["Son rakamı çift olmalı", "Rakamları toplamı 3'e tam bölünmeli", "Son iki rakamı 4'e bölünmeli", "Rakamları toplamı 9 olmalı", "Sayı çift olmalı"], correct: 1, explain: "Bir sayının rakamları toplamı 3'e tam bölünüyorsa, sayının kendisi de 3'e tam bölünür." },
  { id: "q7", category: "Matematik", q: "x + 5 = 12 ise x kaçtır?", options: ["5", "6", "7", "8", "17"], correct: 2, explain: "12 - 5 = 7, dolayısıyla x = 7." },
  { id: "q8", category: "Matematik", q: "Bir dikdörtgenin alanı 48 cm², kısa kenarı 6 cm ise uzun kenarı kaç cm'dir?", options: ["6", "7", "8", "9", "42"], correct: 2, explain: "Alan = kısa kenar × uzun kenar olduğundan 48 / 6 = 8 cm." },
  // Tarih
  { id: "q9", category: "Tarih", q: "TBMM'ye karşı yapılan ilk büyük ayaklanma aşağıdakilerden hangisidir?", options: ["Çopur Musa Ayaklanması", "Bozkır Ayaklanması", "Milli Aşiret Ayaklanması", "Koçgiri Ayaklanması", "Cemil Çeto Ayaklanması"], correct: 1, explain: "Bozkır Ayaklanması, TBMM'nin açılışından kısa süre sonra meclise karşı çıkan ilk iç ayaklanma olarak kabul edilir." },
  { id: "q10", category: "Tarih", q: "Sakarya Meydan Muharebesi'nin sonucunda Mustafa Kemal'e verilen unvanlar nelerdir?", options: ["Gazi ve Mareşal", "Başkomutan ve Gazi", "Mareşal ve Başbakan", "Gazi ve Cumhurbaşkanı", "Başkomutan ve Cumhurbaşkanı"], correct: 0, explain: "Sakarya zaferinin ardından TBMM, Mustafa Kemal'e Mareşal rütbesini ve Gazi unvanını vermiştir." },
  { id: "q11", category: "Tarih", q: "Misak-ı Millî kararları ilk kez hangi kongrede/toplantıda şekillenmiştir?", options: ["Erzurum Kongresi", "Sivas Kongresi", "Son Osmanlı Mebusan Meclisi", "Amasya Görüşmeleri", "Amasya Genelgesi"], correct: 2, explain: "Misak-ı Millî, Erzurum ve Sivas kongrelerinde alınan kararların temel alınmasıyla Son Osmanlı Mebusan Meclisi'nde kabul edilmiştir." },
  { id: "q12", category: "Tarih", q: "Saltanatın kaldırılması hangi tarihte gerçekleşmiştir?", options: ["23 Nisan 1920", "1 Kasım 1922", "29 Ekim 1923", "3 Mart 1924", "20 Ocak 1921"], correct: 1, explain: "TBMM, 1 Kasım 1922'de saltanatı kaldırmış, böylece Osmanlı Devleti hukuken sona ermiştir." },
  // Coğrafya
  { id: "q13", category: "Coğrafya", q: "Türkiye'de en fazla yağış hangi bölgede görülür?", options: ["İç Anadolu", "Doğu Anadolu", "Karadeniz", "Güneydoğu Anadolu", "Akdeniz"], correct: 2, explain: "Karadeniz Bölgesi, dağların kıyıya paralel uzanması ve nemli hava kütlelerinin bu dağlara çarpmasıyla her mevsim bol yağış alır." },
  { id: "q14", category: "Coğrafya", q: "Türkiye'de nüfusun en seyrek olduğu bölge aşağıdakilerden hangisidir?", options: ["Marmara", "Ege", "Doğu Anadolu", "Akdeniz", "İç Anadolu"], correct: 2, explain: "Yükselti ve engebenin fazla, tarım alanlarının kısıtlı olması nedeniyle Doğu Anadolu Bölgesi nüfus yoğunluğu en düşük bölgedir." },
  { id: "q15", category: "Coğrafya", q: "Aşağıdakilerden hangisi bir fay hattı üzerinde yer almaz?", options: ["Kuzey Anadolu Fay Hattı", "Doğu Anadolu Fay Hattı", "Ege Graben Sistemi", "Toros Kıvrım Sistemi", "Marmara Fay Hattı"], correct: 3, explain: "Toros Dağları bir kıvrım (orojenez) sistemidir, fay hattı değil; diğer seçenekler ülkemizdeki başlıca fay sistemleridir." },
  { id: "q16", category: "Coğrafya", q: "Türkiye'nin en uzun akarsuyu hangisidir?", options: ["Fırat", "Kızılırmak", "Sakarya", "Yeşilırmak", "Dicle"], correct: 1, explain: "Kızılırmak, 1355 km ile Türkiye sınırları içinde doğup denize dökülen en uzun akarsudur." },
  // Vatandaşlık
  { id: "q17", category: "Vatandaşlık", q: "Anayasa'ya göre yasama yetkisi kime aittir?", options: ["Cumhurbaşkanına", "Türk Milleti adına TBMM'ye", "Bakanlar Kuruluna", "Anayasa Mahkemesine", "Yargıtaya"], correct: 1, explain: "Anayasa'nın 7. maddesine göre yasama yetkisi Türk Milleti adına TBMM'ye aittir ve bu yetki devredilemez." },
  { id: "q18", category: "Vatandaşlık", q: "TBMM üyeleri kaç yılda bir yenilenir?", options: ["4", "5", "6", "7", "3"], correct: 1, explain: "2017 Anayasa değişikliğiyle TBMM seçimleri 5 yılda bir yapılmaktadır." },
  { id: "q19", category: "Vatandaşlık", q: "Anayasa Mahkemesi üyelerini aşağıdakilerden hangisi seçemez?", options: ["TBMM", "Cumhurbaşkanı", "Yargıtay", "Danıştay", "Bakanlar Kurulu"], correct: 4, explain: "Anayasa Mahkemesi üyeleri TBMM ve Cumhurbaşkanı tarafından, çeşitli yüksek yargı organlarının gösterdiği adaylar arasından seçilir; Bakanlar Kurulunun böyle bir yetkisi yoktur." },
  { id: "q20", category: "Vatandaşlık", q: "Türkiye Cumhuriyeti'nin başkenti Anayasa'nın hangi maddesinde belirtilmiştir?", options: ["1. madde", "2. madde", "3. madde", "4. madde", "5. madde"], correct: 2, explain: "Anayasa'nın 3. maddesi devletin bütünlüğünü, resmi dilini, bayrağını, milli marşını ve başkentini (Ankara) düzenler." },
];

const SEED_ARTICLES = [
  {
    id: "a1",
    title: "Bu Haftanın Çalışma Planı: Türkçe ve Matematik Ağırlıklı",
    category: "Duyuru",
    date: "12.07.2026",
    body: "Bu hafta paragraf sorularında hız kazanmaya ve sayı basamakları konusunu pekiştirmeye odaklanıyoruz. Konu Anlatımı sekmesindeki özetleri tekrar ettikten sonra Soru Bankası'ndan ilgili kategoriyi seçip pratik yapmanızı öneririz.",
  },
  {
    id: "a2",
    title: "Yeni Deneme Sınavı Formatı Yayında",
    category: "Duyuru",
    date: "10.07.2026",
    body: "Deneme Sınavı sekmesi artık karışık kategorilerden 20 soruyu 15 dakikalık gerçek sınav temposunda sunuyor. Sonuç ekranında her sorunun doğru cevabını ve açıklamasını görebilirsiniz.",
  },
];

function getDailyQuestion(pool) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return pool[dayOfYear % pool.length];
}

const CATEGORIES = [...new Set(QUESTIONS.map((q) => q.category))];
const OPTION_LETTERS = ["A", "B", "C", "D", "E"];
const EXAM_DURATION = 900; // 15 dakika

const DEFAULT_PROGRESS = {
  solvedIds: [],
  categoryStats: {},
  bestExamScore: null,
  examAttempts: 0,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* --------------------------- OPTİK BALONCUK --------------------------- */

function OptikBubble({ letter, selected, correct, revealed, onClick, disabled }) {
  let border = COLORS.pencil;
  let fill = "transparent";
  let textColor = COLORS.ink;

  if (revealed) {
    if (correct) {
      border = COLORS.sage;
      fill = COLORS.sage;
      textColor = "#fff";
    } else if (selected && !correct) {
      border = COLORS.danger;
      fill = COLORS.danger;
      textColor = "#fff";
    }
  } else if (selected) {
    border = COLORS.optikRed;
    fill = COLORS.optikRed;
    textColor = "#fff";
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center rounded-full transition-all duration-150 font-mono"
      style={{
        width: 34,
        height: 34,
        minWidth: 34,
        border: `2px solid ${border}`,
        background: fill,
        color: textColor,
        cursor: disabled ? "default" : "pointer",
        fontWeight: 600,
        fontSize: 14,
      }}
      aria-label={`Seçenek ${letter}`}
    >
      {letter}
    </button>
  );
}

/* -------------------------------- REKLAM -------------------------------- */
/* Gerçek reklam geliri için: siteyi bir alan adına yayınla, Google AdSense'e
   (veya tercih ettiğin ağa) başvur, onay sonrası bu bileşenin içine kendi
   reklam kodunu yerleştir. Şimdilik yerleşimi ve boyutu koruyan bir
   yer tutucu gösteriyor. */
function AdSlot({ variant = "banner" }) {
  const isBanner = variant === "banner";
  return (
    <div
      className="flex items-center justify-center rounded-sm w-full"
      style={{
        border: `1px solid ${COLORS.rule}`,
        background: COLORS.paperDark,
        height: isBanner ? 90 : 250,
        color: COLORS.pencil,
      }}
    >
      <div className="text-center">
        <div
          className="font-mono text-[10px] tracking-widest uppercase mb-1 inline-block px-2 py-0.5"
          style={{ background: "#fff", color: COLORS.pencil, border: `1px solid ${COLORS.rule}` }}
        >
          Sponsorlu
        </div>
        <div className="text-xs mt-1" style={{ opacity: 0.6 }}>
          {isBanner ? "728×90 · banner" : "300×250 · kare"}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- NAV ------------------------------- */

const NAV_ITEMS = [
  { id: "home", label: "Ana Sayfa", icon: Home },
  { id: "topics", label: "Konu Anlatımı", icon: BookOpen },
  { id: "bank", label: "Soru Bankası", icon: PenLine },
  { id: "exam", label: "Deneme Sınavı", icon: Clock },
  { id: "progress", label: "İlerleme", icon: BarChart3 },
];

// Bu şifreyi kendi belirleyeceğin bir şifreyle değiştir.
// Bu basit bir istemci-taraflı engelleyicidir, gerçek bir güvenlik katmanı değildir.
const ADMIN_PASSWORD = "atanova2026";

export default function KPSSPlatform() {
  const [page, setPage] = useState("home");
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [articles, setArticles] = useState(SEED_ARTICLES);
  const [customTopics, setCustomTopics] = useState([]);
  const [customQuestions, setCustomQuestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("kpss-progress", false);
        if (res && res.value) {
          setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(res.value) });
        }
      } catch (e) {
        // kayıt yok, varsayılanla devam
      }
      try {
        const res = await window.storage.get("kpss-articles", true);
        if (res && res.value) {
          setArticles(JSON.parse(res.value));
        }
      } catch (e) {
        // henüz paylaşılan yazı yok, örnek içerikle devam
      }
      try {
        const res = await window.storage.get("kpss-custom-topics", true);
        if (res && res.value) {
          setCustomTopics(JSON.parse(res.value));
        }
      } catch (e) {
        // henüz eklenmiş ders yok
      }
      try {
        const res = await window.storage.get("kpss-custom-questions", true);
        if (res && res.value) {
          setCustomQuestions(JSON.parse(res.value));
        }
      } catch (e) {
        // henüz eklenmiş soru yok
      }
      try {
        const res = await window.storage.get("kpss-admin", false);
        if (res && res.value === "true") {
          setIsAdmin(true);
        }
      } catch (e) {
        // giriş yapılmamış
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const unlockAdmin = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      window.storage.set("kpss-admin", "true", false).catch(() => {});
      return true;
    }
    return false;
  }, []);

  const lockAdmin = useCallback(() => {
    setIsAdmin(false);
    window.storage.set("kpss-admin", "false", false).catch(() => {});
  }, []);

  const addQuestion = useCallback((category, q, options, correct, explain) => {
    setCustomQuestions((prev) => {
      const next = [{ id: `cq${Date.now()}`, category, q, options, correct, explain }, ...prev];
      window.storage.set("kpss-custom-questions", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }, []);

  const deleteQuestion = useCallback((id) => {
    setCustomQuestions((prev) => {
      const next = prev.filter((q) => q.id !== id);
      window.storage.set("kpss-custom-questions", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }, []);

  const addArticle = useCallback((title, category, body) => {
    setArticles((prev) => {
      const next = [
        { id: `a${Date.now()}`, title, category, body, date: new Date().toLocaleDateString("tr-TR") },
        ...prev,
      ];
      window.storage.set("kpss-articles", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }, []);

  const deleteArticle = useCallback((id) => {
    setArticles((prev) => {
      const next = prev.filter((a) => a.id !== id);
      window.storage.set("kpss-articles", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }, []);

  const addTopic = useCallback((category, title, body) => {
    setCustomTopics((prev) => {
      const next = [{ id: `ct${Date.now()}`, category, title, body }, ...prev];
      window.storage.set("kpss-custom-topics", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }, []);

  const persist = useCallback(async (next) => {
    setProgress(next);
    try {
      await window.storage.set("kpss-progress", JSON.stringify(next), false);
    } catch (e) {
      // sessizce yoksay, kayıt en iyi çaba ile yapılır
    }
  }, []);

  const recordAnswer = useCallback(
    (question, isCorrect) => {
      setProgress((prev) => {
        const cat = question.category;
        const stats = { ...prev.categoryStats };
        const catStat = stats[cat] || { correct: 0, total: 0 };
        stats[cat] = {
          correct: catStat.correct + (isCorrect ? 1 : 0),
          total: catStat.total + 1,
        };
        const solvedIds = prev.solvedIds.includes(question.id)
          ? prev.solvedIds
          : [...prev.solvedIds, question.id];
        const next = { ...prev, categoryStats: stats, solvedIds };
        window.storage.set("kpss-progress", JSON.stringify(next), false).catch(() => {});
        return next;
      });
    },
    []
  );

  const recordExamResult = useCallback((scoreCount, total) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        examAttempts: prev.examAttempts + 1,
        bestExamScore:
          prev.bestExamScore === null || scoreCount > prev.bestExamScore.correct
            ? { correct: scoreCount, total }
            : prev.bestExamScore,
      };
      window.storage.set("kpss-progress", JSON.stringify(next), false).catch(() => {});
      return next;
    });
  }, []);

  return (
    <div
      className="min-h-screen font-body"
      style={{ background: COLORS.paper, color: COLORS.ink }}
    >
      <style>{FONT_STYLE}</style>

      {/* ÜST BAR */}
      <header className="sticky top-0 z-20" style={{ background: "#fff" }}>
        {/* İnce üst şerit */}
        <div
          className="max-w-5xl mx-auto px-5 py-1.5 hidden sm:flex items-center justify-between"
          style={{ borderBottom: `1px solid ${COLORS.rule}` }}
        >
          <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: COLORS.pencil }}>
            Atanova Yayın Ağı
          </span>
          <span className="font-mono text-[11px]" style={{ color: COLORS.pencil }}>
            {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
        {/* Ana isim (nameplate) */}
        <div className="max-w-5xl mx-auto px-5 pt-4 pb-1 text-center">
          <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: COLORS.ink }}>
            Atanova
          </span>
        </div>
        <div className="max-w-5xl mx-auto px-5 pb-3 text-center">
          <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: COLORS.pencil }}>
            KPSS Hazırlık Platformu
          </span>
        </div>
        {/* Nav şeridi */}
        <nav
          className="max-w-5xl mx-auto px-5 flex items-center justify-center gap-1 sm:gap-6 overflow-x-auto"
          style={{ borderTop: `1px solid ${COLORS.ink}`, borderBottom: `1px solid ${COLORS.ink}` }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className="flex items-center gap-1.5 px-2.5 sm:px-1 py-3 text-xs sm:text-sm whitespace-nowrap font-semibold uppercase tracking-wide transition-colors"
                style={{
                  color: active ? COLORS.ink : COLORS.pencil,
                  borderBottom: active ? `2px solid ${COLORS.optikRed}` : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                <Icon size={13} /> {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {!loaded ? (
          <div className="text-center py-20 text-sm" style={{ color: COLORS.pencil }}>
            Yükleniyor…
          </div>
        ) : page === "home" ? (
          <HomePage
            progress={progress}
            setPage={setPage}
            articles={articles}
            addArticle={addArticle}
            deleteArticle={deleteArticle}
            recordAnswer={recordAnswer}
            isAdmin={isAdmin}
            customQuestions={customQuestions}
          />
        ) : page === "topics" ? (
          <TopicsPage customTopics={customTopics} addTopic={addTopic} isAdmin={isAdmin} />
        ) : page === "bank" ? (
          <BankPage
            progress={progress}
            recordAnswer={recordAnswer}
            customQuestions={customQuestions}
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
            isAdmin={isAdmin}
          />
        ) : page === "exam" ? (
          <ExamPage recordExamResult={recordExamResult} customQuestions={customQuestions} />
        ) : (
          <ProgressPage progress={progress} />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-5 pb-8 pt-2 text-xs flex items-center justify-between" style={{ color: COLORS.pencil }}>
        <span>Bu içerikler genel tekrar amaçlıdır; güncel mevzuat ve resmi kaynaklarla teyit ediniz.</span>
        <AdminGate isAdmin={isAdmin} onUnlock={unlockAdmin} onLock={lockAdmin} />
      </footer>
    </div>
  );
}

function AdminGate({ isAdmin, onUnlock, onLock }) {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAdmin) {
    return (
      <button onClick={onLock} className="underline shrink-0 ml-3">
        Yönetici çıkışı
      </button>
    );
  }

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} className="underline shrink-0 ml-3">
        Yönetici girişi
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0 ml-3">
      <input
        type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(false); }}
        placeholder="Şifre"
        className="px-2 py-1 text-xs w-24"
        style={{ border: `1px solid ${error ? COLORS.danger : COLORS.rule}` }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!onUnlock(password)) setError(true);
          }
        }}
      />
      <button
        onClick={() => { if (!onUnlock(password)) setError(true); }}
        className="text-xs font-semibold"
        style={{ color: COLORS.optikRed }}
      >
        Gir
      </button>
    </div>
  );
}

/* ------------------------------ ANA SAYFA ------------------------------ */

function HomePage({ progress, setPage, articles, addArticle, deleteArticle, recordAnswer, isAdmin, customQuestions }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [openArticleId, setOpenArticleId] = useState(null);

  const dailyQuestion = getDailyQuestion([...QUESTIONS, ...customQuestions]);
  const todayLabel = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          a.title.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")) ||
          a.body.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))
      )
    : articles;

  return (
    <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10 lg:items-start">
      {/* ANA SÜTUN — sadece haber akışı */}
      <div>
        {/* Bölüm başlığı */}
        <div
          className="flex items-end justify-between mb-5 pb-2"
          style={{ borderBottom: `2px solid ${COLORS.ink}` }}
        >
          <div>
            <p className="font-mono text-[11px] tracking-widest uppercase mb-1" style={{ color: COLORS.pencil }}>
              {todayLabel.toLocaleUpperCase("tr")}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: COLORS.ink }}>
              Gündem
            </h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white shrink-0"
              style={{ background: COLORS.ink }}
            >
              {showForm ? <X size={15} /> : <Plus size={15} />}
              {showForm ? "Vazgeç" : "Yeni Yazı"}
            </button>
          )}
        </div>

        {/* Arama */}
        <div className="relative mb-6">
          <Search size={15} style={{ color: COLORS.pencil, position: "absolute", left: 12, top: 12 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bir haberi ya da yazıyı ara…"
            className="w-full pl-9 pr-3 py-2.5 text-sm font-body outline-none"
            style={{ border: `1px solid ${COLORS.rule}`, background: "#fff", color: COLORS.ink }}
          />
        </div>

        {isAdmin && showForm && <ArticleForm onSubmit={(title, category, body) => { addArticle(title, category, body); setShowForm(false); }} />}

        {/* Yazı listesi — gazete ön sayfası düzeni */}
        <div>
          {filtered.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: COLORS.pencil }}>
              "{query}" için bir sonuç bulunamadı.
            </p>
          ) : (
            filtered.map((a, i) => (
              <div key={a.id}>
                {i > 0 && i % 3 === 0 && (
                  <div className="my-5">
                    <AdSlot variant="banner" />
                  </div>
                )}
                <ArticleCard
                  article={a}
                  open={openArticleId === a.id}
                  onToggle={() => setOpenArticleId(openArticleId === a.id ? null : a.id)}
                  onDelete={() => deleteArticle(a.id)}
                  isFirst={i === 0}
                  isAdmin={isAdmin}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* YAN SÜTUN — küçük, sabit duran Günün Sorusu widget'ı */}
      <aside className="mt-8 lg:mt-0">
        <div className="lg:sticky lg:top-24">
          <DailyQuestionWidget question={dailyQuestion} recordAnswer={recordAnswer} />
        </div>
      </aside>
    </div>
  );
}

function DailyQuestionWidget({ question, recordAnswer }) {
  const [selected, setSelected] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const revealed = selected !== null;

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    recordAnswer(question, idx === question.correct);
  };

  if (dismissed) return null;

  return (
    <div className="p-4 relative" style={{ background: COLORS.paperDark, border: `1px solid ${COLORS.ink}` }}>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Kapat"
        className="absolute top-2 right-2"
        style={{ color: COLORS.pencil }}
      >
        <X size={14} />
      </button>
      <span
        className="font-mono text-[10px] tracking-widest uppercase px-1.5 py-0.5 text-white inline-block mb-2.5"
        style={{ background: COLORS.ink }}
      >
        Günün Sorusu
      </span>
      <p className="font-display font-semibold text-sm leading-snug mb-3 pr-4" style={{ color: COLORS.ink }}>
        {question.q}
      </p>
      <div className="space-y-1.5">
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <OptikBubble
              letter={OPTION_LETTERS[idx]}
              selected={selected === idx}
              correct={idx === question.correct}
              revealed={revealed}
              disabled={revealed}
              onClick={() => handleSelect(idx)}
            />
            <span className="text-xs leading-snug" style={{ color: COLORS.ink }}>
              {opt}
            </span>
          </div>
        ))}
      </div>
      {revealed && (
        <div
          className="mt-3 text-xs p-2.5 flex items-start gap-1.5"
          style={{ background: "#fff", color: COLORS.pencil, border: `1px solid ${COLORS.rule}` }}
        >
          {selected === question.correct ? (
            <CheckCircle2 size={13} style={{ color: COLORS.sage, flexShrink: 0, marginTop: 1 }} />
          ) : (
            <XCircle size={13} style={{ color: COLORS.danger, flexShrink: 0, marginTop: 1 }} />
          )}
          <span>{question.explain}</span>
        </div>
      )}
    </div>
  );
}

function ArticleForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Duyuru");
  const [body, setBody] = useState("");

  return (
    <div className="rounded-sm p-4 mb-5" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık"
          className="px-3 py-2 rounded text-sm outline-none"
          style={{ border: `1px solid ${COLORS.rule}` }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded text-sm outline-none"
          style={{ border: `1px solid ${COLORS.rule}` }}
        >
          {["Duyuru", "Ders Notu", "Sınav Takvimi", "Motivasyon"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Yazının içeriği…"
        rows={4}
        className="w-full px-3 py-2 rounded text-sm outline-none mb-3"
        style={{ border: `1px solid ${COLORS.rule}` }}
      />
      <button
        onClick={() => {
          if (!title.trim() || !body.trim()) return;
          onSubmit(title.trim(), category, body.trim());
          setTitle("");
          setBody("");
        }}
        className="px-4 py-2 rounded text-sm font-medium text-white"
        style={{ background: COLORS.ink }}
      >
        Yayınla
      </button>
      <p className="text-xs mt-2" style={{ color: COLORS.pencil }}>
        Bu yazı siteyi ziyaret eden herkese görünür.
      </p>
    </div>
  );
}

function ArticleCard({ article, open, onToggle, onDelete, isFirst, isAdmin }) {
  return (
    <div className={isFirst ? "pb-6 mb-6" : "py-5"} style={{ borderBottom: isFirst ? `1px solid ${COLORS.rule}` : `1px solid ${COLORS.rule}` }}>
      <div className="flex items-start justify-between gap-3">
        <button onClick={onToggle} className="text-left flex-1 group">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="font-mono text-[11px] tracking-wide px-1.5 py-0.5 font-semibold uppercase"
              style={{ background: COLORS.ink, color: "#fff" }}
            >
              {article.category}
            </span>
            <span className="font-mono text-xs" style={{ color: COLORS.pencil }}>
              {article.date}
            </span>
          </div>
          <h3
            className={`font-display font-bold leading-snug group-hover:opacity-70 transition-opacity ${isFirst ? "text-2xl sm:text-3xl" : "text-xl"}`}
            style={{ color: COLORS.ink }}
          >
            {article.title}
          </h3>
          {(!open || isFirst) && (
            <p className={`mt-2 ${isFirst ? "text-base" : "text-sm line-clamp-2 mt-1.5"}`} style={{ color: COLORS.pencil }}>
              {article.body}
            </p>
          )}
          {!open && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold mt-2" style={{ color: COLORS.optikRed }}>
              Devamını oku <ChevronRight size={13} />
            </span>
          )}
        </button>
        {isAdmin && (
          <button onClick={onDelete} aria-label="Yazıyı sil" style={{ color: COLORS.pencil }} className="mt-1 shrink-0">
            <Trash2 size={15} />
          </button>
        )}
      </div>
      {open && !isFirst && (
        <p className="text-sm mt-3 leading-relaxed" style={{ color: COLORS.pencil }}>
          {article.body}
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-sm p-4 text-center" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
      <div className="font-mono text-2xl font-semibold" style={{ color: COLORS.ink }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: COLORS.pencil }}>
        {label}
      </div>
    </div>
  );
}

function NavCard({ icon: Icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-sm p-4 transition-transform hover:-translate-y-0.5"
      style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}
    >
      <Icon size={20} style={{ color: COLORS.optikRed }} />
      <div className="font-display font-semibold mt-2" style={{ color: COLORS.ink }}>
        {title}
      </div>
      <div className="text-sm mt-1" style={{ color: COLORS.pencil }}>
        {desc}
      </div>
      <div className="flex items-center gap-1 text-xs mt-3" style={{ color: COLORS.optikRed }}>
        Git <ChevronRight size={13} />
      </div>
    </button>
  );
}

/* ---------------------------- KONU ANLATIMI ---------------------------- */

function TopicsPage({ customTopics, addTopic, isAdmin }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const allTopics = [...customTopics, ...TOPICS];
  const topicCategories = [...new Set(allTopics.map((t) => t.category))];

  if (!selectedCategory) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-2xl font-bold">Konu Anlatımı</h2>
          {isAdmin && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: COLORS.ink }}
            >
              {showForm ? <X size={13} /> : <Plus size={13} />}
              {showForm ? "Vazgeç" : "Ders Ekle"}
            </button>
          )}
        </div>
        <p className="text-sm mb-5" style={{ color: COLORS.pencil }}>
          Bir kategori seç, içindeki dersleri gör.
        </p>

        {isAdmin && showForm && (
          <TopicForm
            onSubmit={(category, title, body) => {
              addTopic(category, title, body);
              setShowForm(false);
            }}
          />
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {topicCategories.map((cat) => {
            const count = allTopics.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="text-left p-4 flex items-center justify-between"
                style={{ border: `1px solid ${COLORS.rule}`, background: "#fff" }}
              >
                <div>
                  <span className="font-display font-bold text-lg" style={{ color: COLORS.ink }}>
                    {cat}
                  </span>
                  <div className="font-mono text-xs mt-1" style={{ color: COLORS.pencil }}>
                    {count} ders
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: COLORS.pencil }} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const topicsInCategory = allTopics.filter((t) => t.category === selectedCategory);

  return (
    <div>
      <button
        onClick={() => { setSelectedCategory(null); setOpenId(null); setShowForm(false); }}
        className="flex items-center gap-1 text-sm mb-4 font-medium"
        style={{ color: COLORS.pencil }}
      >
        <ChevronLeft size={15} /> Kategorilere dön
      </button>

      <div className="flex items-center justify-between mb-5 pb-2" style={{ borderBottom: `2px solid ${COLORS.ink}` }}>
        <h2 className="font-display text-2xl font-bold" style={{ color: COLORS.ink }}>
          {selectedCategory}
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: COLORS.ink }}
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? "Vazgeç" : "Ders Ekle"}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <TopicForm
          defaultCategory={selectedCategory}
          onSubmit={(category, title, body) => {
            addTopic(category, title, body);
            setShowForm(false);
          }}
        />
      )}

      <div className="space-y-2">
        {topicsInCategory.map((t) => {
          const open = openId === t.id;
          return (
            <div key={t.id} style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
              <button
                onClick={() => setOpenId(open ? null : t.id)}
                className="w-full flex items-center justify-between py-3.5 text-left"
              >
                <span className="font-display font-semibold" style={{ color: COLORS.ink }}>
                  {t.title}
                </span>
                <ChevronRight size={16} style={{ color: COLORS.pencil, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              </button>
              {open && (
                <p className="text-sm leading-relaxed pb-4" style={{ color: COLORS.pencil }}>
                  {t.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopicForm({ onSubmit, defaultCategory }) {
  const [category, setCategory] = useState(defaultCategory || CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="rounded-sm p-4 mb-5" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded text-sm outline-none"
          style={{ border: `1px solid ${COLORS.rule}` }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ders başlığı"
          className="px-3 py-2 rounded text-sm outline-none"
          style={{ border: `1px solid ${COLORS.rule}` }}
        />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Ders içeriği…"
        rows={4}
        className="w-full px-3 py-2 rounded text-sm outline-none mb-3"
        style={{ border: `1px solid ${COLORS.rule}` }}
      />
      <button
        onClick={() => {
          if (!title.trim() || !body.trim()) return;
          onSubmit(category, title.trim(), body.trim());
          setTitle("");
          setBody("");
        }}
        className="px-4 py-2 rounded text-sm font-medium text-white"
        style={{ background: COLORS.ink }}
      >
        Dersi Yayınla
      </button>
      <p className="text-xs mt-2" style={{ color: COLORS.pencil }}>
        Bu ders siteyi ziyaret eden herkese görünür.
      </p>
    </div>
  );
}

/* ----------------------------- SORU BANKASI ----------------------------- */

function BankPage({ progress, recordAnswer, customQuestions, addQuestion, deleteQuestion, isAdmin }) {
  const [category, setCategory] = useState("Tümü");
  const [answers, setAnswers] = useState({}); // qid -> selectedIndex
  const [showForm, setShowForm] = useState(false);

  const allQuestions = [...QUESTIONS, ...customQuestions];
  const filtered = category === "Tümü" ? allQuestions : allQuestions.filter((q) => q.category === category);

  const handleSelect = (question, idx) => {
    if (answers[question.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [question.id]: idx }));
    recordAnswer(question, idx === question.correct);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-2xl font-bold">Soru Bankası</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: COLORS.ink }}
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? "Vazgeç" : "Soru Ekle"}
          </button>
        )}
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.pencil }}>
        Bir seçeneği işaretle, doğru cevap anında gösterilir.
      </p>

      {isAdmin && showForm && (
        <QuestionForm
          onSubmit={(cat, q, options, correct, explain) => {
            addQuestion(cat, q, options, correct, explain);
            setShowForm(false);
          }}
        />
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {["Tümü", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
            style={{
              background: category === c ? COLORS.ink : "#fff",
              color: category === c ? "#fff" : COLORS.ink,
              border: `1px solid ${COLORS.ink}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((question, i) => {
          const selected = answers[question.id];
          const revealed = selected !== undefined;
          const isCustom = question.id.startsWith("cq");
          return (
            <div key={question.id}>
            {i > 0 && i % 4 === 0 && (
              <div className="mb-4">
                <AdSlot variant="banner" />
              </div>
            )}
            <div className="rounded-sm p-4" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs mt-0.5" style={{ color: COLORS.pencil }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-medium text-sm sm:text-base">{question.q}</p>
                </div>
                {isAdmin && isCustom && (
                  <button onClick={() => deleteQuestion(question.id)} aria-label="Soruyu sil" style={{ color: COLORS.pencil }} className="shrink-0">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-2 pl-7">
                {question.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <OptikBubble
                      letter={OPTION_LETTERS[idx]}
                      selected={selected === idx}
                      correct={idx === question.correct}
                      revealed={revealed}
                      disabled={revealed}
                      onClick={() => handleSelect(question, idx)}
                    />
                    <span className="text-sm" style={{ color: COLORS.pencil }}>
                      {opt}
                    </span>
                  </div>
                ))}
              </div>
              {revealed && (
                <div
                  className="mt-3 ml-7 text-sm rounded p-3 flex items-start gap-2"
                  style={{
                    background: selected === question.correct ? COLORS.sageBg : COLORS.redBg,
                    color: COLORS.ink,
                  }}
                >
                  {selected === question.correct ? (
                    <CheckCircle2 size={16} style={{ color: COLORS.sage, flexShrink: 0, marginTop: 2 }} />
                  ) : (
                    <XCircle size={16} style={{ color: COLORS.danger, flexShrink: 0, marginTop: 2 }} />
                  )}
                  <span>{question.explain}</span>
                </div>
              )}
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionForm({ onSubmit }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [q, setQ] = useState("");
  const [options, setOptions] = useState(["", "", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [explain, setExplain] = useState("");

  const updateOption = (idx, value) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? value : o)));
  };

  const handleSubmit = () => {
    if (!q.trim() || options.some((o) => !o.trim()) || !explain.trim()) return;
    onSubmit(category, q.trim(), options.map((o) => o.trim()), correct, explain.trim());
  };

  return (
    <div className="p-4 mb-5" style={{ background: "#fff", border: `1px solid ${COLORS.rule}` }}>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 text-sm outline-none"
          style={{ border: `1px solid ${COLORS.rule}` }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Soru metni"
          className="px-3 py-2 text-sm outline-none"
          style={{ border: `1px solid ${COLORS.rule}` }}
        />
      </div>
      <p className="text-xs font-semibold mb-1.5" style={{ color: COLORS.pencil }}>
        Seçenekler (doğru cevabın yanındaki daireyi işaretle)
      </p>
      <div className="space-y-2 mb-3">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <button
              onClick={() => setCorrect(idx)}
              className="flex items-center justify-center rounded-full shrink-0 font-mono text-xs font-semibold"
              style={{
                width: 26,
                height: 26,
                border: `2px solid ${correct === idx ? COLORS.sage : COLORS.rule}`,
                background: correct === idx ? COLORS.sage : "transparent",
                color: correct === idx ? "#fff" : COLORS.pencil,
              }}
            >
              {OPTION_LETTERS[idx]}
            </button>
            <input
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
              placeholder={`${OPTION_LETTERS[idx]} seçeneği`}
              className="flex-1 px-3 py-1.5 text-sm outline-none"
              style={{ border: `1px solid ${COLORS.rule}` }}
            />
          </div>
        ))}
      </div>
      <textarea
        value={explain}
        onChange={(e) => setExplain(e.target.value)}
        placeholder="Doğru cevabın açıklaması…"
        rows={3}
        className="w-full px-3 py-2 text-sm outline-none mb-3"
        style={{ border: `1px solid ${COLORS.rule}` }}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 text-sm font-semibold text-white"
        style={{ background: COLORS.ink }}
      >
        Soruyu Yayınla
      </button>
    </div>
  );
}

/* ----------------------------- DENEME SINAVI ----------------------------- */

function ExamPage({ recordExamResult, customQuestions }) {
  const [status, setStatus] = useState("idle"); // idle | running | finished
  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const timerRef = useRef(null);

  const questionPool = [...QUESTIONS, ...customQuestions];
  const examSize = Math.min(20, questionPool.length);

  const startExam = () => {
    setExamQuestions(shuffle(questionPool).slice(0, examSize));
    setAnswers({});
    setTimeLeft(EXAM_DURATION);
    setStatus("running");
  };

  const finishExam = useCallback(() => {
    setStatus((prevStatus) => {
      if (prevStatus !== "running") return prevStatus;
      return "finished";
    });
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finishExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, finishExam]);

  useEffect(() => {
    if (status === "finished" && examQuestions.length > 0) {
      const correctCount = examQuestions.reduce(
        (acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0),
        0
      );
      recordExamResult(correctCount, examQuestions.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  if (status === "idle") {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <Clock size={32} style={{ color: COLORS.optikRed }} className="mx-auto mb-3" />
        <h2 className="font-display text-2xl font-bold mb-2">Deneme Sınavı</h2>
        <p className="text-sm mb-6" style={{ color: COLORS.pencil }}>
          {examSize} soru · {EXAM_DURATION / 60} dakika · Karışık kategori. Süre bitince sınav otomatik teslim edilir.
        </p>
        <button
          onClick={startExam}
          className="px-5 py-2.5 rounded text-sm font-medium text-white"
          style={{ background: COLORS.optikRed }}
        >
          Sınavı Başlat
        </button>
      </div>
    );
  }

  if (status === "finished") {
    const correctCount = examQuestions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
    return (
      <div>
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold mb-1">Sınav Tamamlandı</h2>
          <p className="font-mono text-3xl font-semibold" style={{ color: COLORS.optikRed }}>
            {correctCount} / {examQuestions.length}
          </p>
          <button
            onClick={startExam}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
            style={{ border: `1px solid ${COLORS.ink}` }}
          >
            <RotateCcw size={14} /> Yeni Deneme Başlat
          </button>
        </div>

        <div className="mb-6">
          <AdSlot variant="banner" />
        </div>

        <div className="space-y-4">
          {examQuestions.map((question, i) => {
            const selected = answers[question.id];
            return (
              <div key={question.id} className="rounded-sm p-4" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
                <div className="flex items-start gap-2 mb-3">
                  <span className="font-mono text-xs mt-0.5" style={{ color: COLORS.pencil }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-medium text-sm sm:text-base">{question.q}</p>
                </div>
                <div className="space-y-2 pl-7">
                  {question.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <OptikBubble
                        letter={OPTION_LETTERS[idx]}
                        selected={selected === idx}
                        correct={idx === question.correct}
                        revealed
                        disabled
                        onClick={() => {}}
                      />
                      <span className="text-sm" style={{ color: COLORS.pencil }}>
                        {opt}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-3 ml-7 text-sm rounded p-3"
                  style={{ background: selected === question.correct ? COLORS.sageBg : COLORS.redBg }}
                >
                  {question.explain}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // status === "running"
  const answeredCount = Object.keys(answers).length;
  return (
    <div>
      <div
        className="sticky top-0 z-10 flex items-center justify-between mb-5 px-4 py-2.5 rounded"
        style={{ background: COLORS.ink, color: "#fff" }}
      >
        <span className="text-sm">
          Cevaplanan: <span className="font-mono">{answeredCount}/{examQuestions.length}</span>
        </span>
        <span className="font-mono text-lg font-semibold" style={{ color: timeLeft < 60 ? COLORS.danger : "#fff" }}>
          {mm}:{ss}
        </span>
      </div>

      <div className="space-y-4">
        {examQuestions.map((question, i) => (
          <div key={question.id} className="rounded-sm p-4" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
            <div className="flex items-start gap-2 mb-3">
              <span className="font-mono text-xs mt-0.5" style={{ color: COLORS.pencil }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-medium text-sm sm:text-base">{question.q}</p>
            </div>
            <div className="space-y-2 pl-7">
              {question.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <OptikBubble
                    letter={OPTION_LETTERS[idx]}
                    selected={answers[question.id] === idx}
                    correct={false}
                    revealed={false}
                    disabled={false}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: idx }))}
                  />
                  <span className="text-sm" style={{ color: COLORS.pencil }}>
                    {opt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={finishExam}
          className="px-5 py-2.5 rounded text-sm font-medium text-white"
          style={{ background: COLORS.optikRed }}
        >
          Sınavı Teslim Et
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- İLERLEME ------------------------------- */

function ProgressPage({ progress }) {
  const cats = CATEGORIES.map((c) => ({
    name: c,
    ...(progress.categoryStats[c] || { correct: 0, total: 0 }),
  }));

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-1">İlerleme</h2>
      <p className="text-sm mb-5" style={{ color: COLORS.pencil }}>
        Kategori bazlı doğruluk oranların ve deneme sınavı geçmişin.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <StatCard label="Deneme Denemesi" value={progress.examAttempts} />
        <StatCard
          label="En İyi Deneme Skoru"
          value={progress.bestExamScore ? `${progress.bestExamScore.correct}/${progress.bestExamScore.total}` : "Henüz yok"}
        />
      </div>

      <div className="space-y-3">
        {cats.map((c) => {
          const pct = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
          return (
            <div key={c.name} className="rounded-sm p-4" style={{ background: "#fff", border: `1px solid ${COLORS.rule}`, boxShadow: "0 1px 2px rgba(21,19,43,0.04)" }}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{c.name}</span>
                <span className="font-mono" style={{ color: COLORS.pencil }}>
                  {c.correct}/{c.total} · %{pct}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: COLORS.paperDark }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: pct >= 70 ? COLORS.sage : pct >= 40 ? COLORS.warning : COLORS.danger }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
