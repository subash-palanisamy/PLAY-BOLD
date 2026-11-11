import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";

// ── Banner data ────────────────────────────────────────────
const BANNERS = [
  {
    image: "/images/banner/banner-1.png",
    link: "/men/running/nitro-collection/puma-x-aston-martin-aramco-f1-team-inverse-mens-sneakers",
  },
  {
    image: "/images/banner/banner-2.png",
    link: "/men/casual/lost-temple-collection/adidas-ranveer-singh-superstar",
  },
  {
    image: "/images/banner/banner-3.png",
    link: "/women/lifestyle/nike-court-legacy-lift-womens-shoes",
  },
  {
    image: "/images/banner/banner-4.png",
    link: "/women/casual/lost-temple-collection/nike-air-force-1-07",
  },
  {
    image: "/images/banner/banner-5.png",
    link: "/kids/indoor%20sports/puma-varion-ii-youth",
  },
  {
    image: "/images/banner/banner-6.png",
    link: "/kids/basketball/minecraft-collection/nike-jordan-spizike-low",
  },
];

// ── Scroll-reveal hook ─────────────────────────────────────
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
};

// ── Section header (no hover) ──────────────────────────────
const SectionHeader = ({ tag, title, linkTo, linkLabel }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div>
        <p className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-emerald-300/80 mb-3">
          {tag}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
          {title}
        </h2>
        <div className="mt-4 h-[2px] w-16 bg-gradient-to-r from-emerald-400 to-transparent" />
      </div>

      <Link
        to={linkTo}
        className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-300"
      >
        {linkLabel}
        <span>→</span>
      </Link>
    </div>
  );
};

// ── Banner (image-only, no overlay, no hover) ──────────────
const Banner = ({ image, link }) => {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref}
      className={`relative w-full overflow-hidden transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ paddingTop: "39.7%" }}
    >
      <Link to={link} className="absolute inset-0 block">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        />
      </Link>
    </section>
  );
};

// ── Hero (no hover, no animated text) ──────────────────────
const Hero = ({ banner }) => (
  <section className="relative w-full overflow-hidden" style={{ paddingTop: "39.7%" }}>
    <Link to={banner.link} className="absolute inset-0 block">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${banner.image})` }}
      />
    </Link>
  </section>
);

// ── Product section wrapper ────────────────────────────────
const ProductSection = ({ tag, title, linkTo, linkLabel, gender, picks, bg }) => {
  const { ref, visible } = useReveal();
  return (
    <section className={`py-24 ${bg}`}>
      <div className="container mx-auto px-6 lg:px-16">
        <SectionHeader tag={tag} title={title} linkTo={linkTo} linkLabel={linkLabel} />
        <div
          ref={ref}
          className={`transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <ProductGrid gender={gender} category="shoes" picks={picks} />
        </div>
      </div>
    </section>
  );
};

// ── Lost Temple section (no hover) ─────────────────────────
const lostTempleFacts = [
  { icon: "◆", title: "Weathered Stone", text: "Rugged, textured surfaces" },
  { icon: "❖", title: "Moss & Roots", text: "Deep forest greens" },
  { icon: "➤", title: "Hidden Trails", text: "Made for those who explore" },
];

const LostTempleIntro = () => {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top left, #14503c 0%, #0b241b 70%)",
      }}
    >
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div
          className={`transition-all duration-1000 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-300/80">
            /// Collection Story
          </span>
          <h2 className="mt-4 font-serif text-[#e6f4e8] text-4xl md:text-6xl leading-[1.05] mb-6">
            Lost Temple
            <br />
            <span className="text-emerald-300">Collection</span>
          </h2>
          <p className="font-serif italic text-xl md:text-2xl text-emerald-200/90 max-w-[30ch]">
            Deep within a forgotten forest, an ancient temple lies hidden
            beneath vines and moss, guarded by nature itself.
          </p>
        </div>

        <div
          className={`transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <p className="text-emerald-100/70 leading-relaxed max-w-[58ch] mb-10">
            Roots have pushed through old stone, moss has softened carved
            walls, and some temples now rest beneath still water. Lost Temple
            takes that feeling of discovery and brings it into footwear — the
            strength of weathered stone, the texture of the wilderness, and
            the freedom of unexplored trails.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {lostTempleFacts.map((f) => (
              <li
                key={f.title}
                className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-400/20 backdrop-blur-sm"
              >
                <span className="text-emerald-300 text-xl">{f.icon}</span>
                <b className="block font-serif text-base text-emerald-200 mt-2">
                  {f.title}
                </b>
                <span className="text-xs text-emerald-200/60">{f.text}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/lost-temple-collection"
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-300 text-[#0b241b] font-bold uppercase tracking-wider text-sm rounded-full"
          >
            Follow the Trail
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ════════════════════════════════════════════════════════════
const Home = () => {
  return (
    <>
      <Navbar />
      <main className="bg-[#0b241b]">
        {/* HERO / BANNER 1 */}
        <Hero banner={BANNERS[0]} />

        {/* MEN */}
        <ProductSection
          tag="/// Play Bold · Men"
          title="Born to Move"
          linkTo="/men/shoes"
          linkLabel="Explore Men"
          gender="men"
          picks={[2, 9, 5, 10]}
          bg="bg-[#0b241b]"
        />

        {/* BANNER 2 */}
        <Banner image={BANNERS[1].image} link={BANNERS[1].link} />

        {/* LOST TEMPLE */}
        <LostTempleIntro />

        {/* BANNER 3 */}
        <Banner image={BANNERS[2].image} link={BANNERS[2].link} />

        {/* WOMEN */}
        <ProductSection
          tag="/// Live Bold · Women"
          title="Built for Her Journey"
          linkTo="/women/shoes"
          linkLabel="Explore Women"
          gender="women"
          picks={[9, 3, 11, 7]}
          bg="bg-[#0b241b]"
        />

        {/* BANNER 4 */}
        <Banner image={BANNERS[3].image} link={BANNERS[3].link} />

        {/* BANNER 5 */}
        <Banner image={BANNERS[4].image} link={BANNERS[4].link} />

        {/* KIDS */}
        <ProductSection
          tag="/// Wild at Heart · Kids"
          title="Little Explorers"
          linkTo="/kids/shoes"
          linkLabel="Explore Kids"
          gender="kids"
          picks={[2, 5, 9, 11]}
          bg="bg-[#14503c]"
        />

        {/* BANNER 6 */}
        <Banner image={BANNERS[5].image} link={BANNERS[5].link} />
      </main>
      <Footer />
    </>
  );
};

export default Home;