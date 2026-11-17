import ScrollSequence from "@/components/ScrollSequence";
import BrandEnd from "@/components/BrandEnd";

const AI_BADGE = "Бодит бүтээгдэхүүн · Орчин, хөдөлгөөнийг AI-аар бүтээв";

const NAV = ["Эмэгтэй", "Эрэгтэй", "Хүүхэд", "Ноолуур", "Ноос", "Коллекц"];

// Зөвхөн баталгаажсан тоонууд. Тайлбар бичвэрийг өөрөө шалгаж засаарай.
const STATS = [
  { value: "2011", label: "оноос хойш" },
  { value: "16", label: "улс" },
  { value: "18", label: "дэлгүүр" },
  { value: "100+", label: "ажилтан" },
  { value: "14,500 м²", label: "талбай" },
  { value: "ISO 9001", label: "чанарын удирдлага" },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        {/* TODO: бодит лого (SVG) оруулах */}
        <a href="/" className="logo">TODSOCKS</a>
        <nav aria-label="Үндсэн цэс">
          <ul>
            {NAV.map((item) => (
              <li key={item}>
                <a href="#products">{item}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <ScrollSequence scene="hero" scrollVh={350} label="Оймсны хөдөлгөөнт зураг" badge={AI_BADGE}>
          <h1>2011 оноос Монголын дулааныг дэлгэрүүлэв</h1>
        </ScrollSequence>

        <BrandEnd />

        <section className="stats" aria-label="Тоон үзүүлэлт">
          {STATS.map((s) => (
            <div key={s.value} className="stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        <section id="products" className="products" aria-label="Бүтээгдэхүүн">
          <h2>Бүтээгдэхүүн</h2>
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card">
                <div className="card-img" />
                <p>Бүтээгдэхүүн {i + 1}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        {/* TODO: бодит мэдээллээр солих */}
        <div>
          <p><strong>Хаяг:</strong> [хаяг]</p>
          <p><strong>Утас:</strong> [утас]</p>
          <p><strong>Имэйл:</strong> [имэйл]</p>
          <p><strong>Ажлын цаг:</strong> [цаг]</p>
        </div>
        <p className="disclaimer">
          Энэ хуудасны хөдөлгөөнт дүрслэлүүдийг бодит гэрэл зураг дээр суурилан AI ашиглан хөдөлгөсөн болно.
        </p>
      </footer>
    </>
  );
}
