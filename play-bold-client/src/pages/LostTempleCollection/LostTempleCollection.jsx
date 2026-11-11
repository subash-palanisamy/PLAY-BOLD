import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Palette: g1 #0b241b | g2 #14503c | g3 #1e7f5c | g4 #5db894 | g5 #a6d98f
// Text: #e6f4e8 (headings) | #b9d9c4 (paragraphs)
// All images are full-bleed and touch the page edges.

const IMG = "/images/banner/ltc/";

const h2 = "font-serif text-[#e6f4e8] text-3xl md:text-5xl leading-tight mb-5";
const p = "leading-relaxed max-w-[58ch] mb-4";
const quote = "font-serif italic text-xl md:text-2xl text-[#a6d98f]";

// Half image (touches the page edge), half text
const Split = ({ img, alt, flip = false, bg = "bg-[#0b241b]", children }) => (
  <section className={`grid grid-cols-1 md:grid-cols-2 ${bg}`}>
    <div className={`relative min-h-[380px] md:min-h-[580px] ${flip ? "md:order-2" : ""}`}>
      <img
        src={IMG + img}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <div className={`flex flex-col justify-center px-[6vw] md:px-14 py-14 md:py-20 ${flip ? "md:order-1" : ""}`}>
      {children}
    </div>
  </section>
);

// Full-width image with text laid over it
const Overlay = ({ img, alt, children }) => (
  <section className="relative flex items-center justify-center text-center px-[6vw] py-24 md:py-36 overflow-hidden">
    <img src={IMG + img} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-[#0b241b]/70" />
    <div className="relative max-w-[40ch] md:max-w-[60ch]">{children}</div>
  </section>
);

const details = [
  { img: "ltc-10.jpg", title: "Worn Steps", text: "Cracked stone and roots inspire textured, grippy outsole patterns." },
  { img: "ltc-11.jpg", title: "Moss on Stone", text: "Deep greens and soft surfaces shape the colour story." },
  { img: "ltc-12.jpg", title: "Fallen Stones", text: "Rough, layered texture inspires bold overlays and panels." },
  { img: "ltc-13.jpg", title: "Carved Halls", text: "Old carvings inspire fine, detailed patterns on the upper." },
];

const LostTempleCollection = () => {
  return (
    <div>
      <Navbar />
      <main className="bg-[#0b241b] text-[#b9d9c4] font-sans overflow-x-hidden">
        {/* Intro + hero */}
        <section className="px-[6vw] pt-16 md:pt-24 pb-12 text-center">
          <h1 className="font-serif text-[#e6f4e8] text-4xl md:text-6xl leading-tight mb-4">
            Lost Temple Collection
          </h1>
          <p className="text-lg text-[#a6d98f]">
            Step into the unknown. Follow the forgotten trail.
          </p>
        </section>
        <img
          src={IMG + "ltc-1.png"}
          alt="Lost Temple Collection: an ancient temple deep in the forest"
          className="block w-full h-auto"
        />

        {/* 1. The Forgotten Place */}
        <Split img="ltc-2.jpg" alt="A forgotten temple lit by shafts of sunlight" bg="bg-[#14503c]">
          <h2 className={h2}>The Forgotten Place</h2>
          <p className={p}>
            Deep within a forgotten forest, where ancient trees rise above the
            mist and sunlight struggles to reach the ground, the remains of an
            ancient temple slowly disappear into the wilderness.
          </p>
          <p className={p}>
            Nature has grown around its walls, roots have found their way
            through old stones, and every path seems to carry a story of its
            own. The forest has become its guardian, keeping the place away
            from the noise of the outside world.
          </p>
        </Split>

        {/* 2. Beneath the Vines */}
        <Split img="ltc-3.jpg" alt="Vines wrapped around temple walls" flip>
          <h2 className={h2}>Beneath the Vines</h2>
          <p className={p}>
            The deeper you travel, the quieter everything becomes. Broken
            steps appear beneath fallen leaves, weathered pillars stand
            between enormous trees, and old carvings wait under years of
            growth.
          </p>
          <p className={p}>
            There is no clear map to guide the way, only traces left behind
            by a place that once stood with purpose. The temple feels less
            like a ruin and more like a secret the forest has chosen to
            protect.
          </p>
        </Split>

        {/* 3. The Discovery */}
        <Split img="ltc-4.jpg" alt="Giant roots wrapped around a hidden temple" bg="bg-[#14503c]">
          <h2 className={h2}>The Discovery</h2>
          <p className={p}>
            Following the trail deeper, the forest begins to open around the
            ruins. What first appeared to be scattered stones slowly becomes
            something greater: a forgotten temple hidden within an untouched
            wilderness.
          </p>
          <p className={p}>
            With every step closer, curiosity becomes stronger than the fear
            of what might be waiting beyond the next path.
          </p>
        </Split>

        {/* Quote band */}
        <Overlay img="ltc-5.jpg" alt="Misty forest with temples and giant trees">
          <p className="font-serif italic text-3xl md:text-5xl leading-snug text-[#a6d98f]">
            The journey itself becomes part of the discovery.
          </p>
        </Overlay>

        {/* 4. Once a living home */}
        <Split img="ltc-6.jpg" alt="A giant stone face covered in vines and roots">
          <h2 className={h2}>Once a Living Home</h2>
          <p className={p}>
            Long ago, this forest was a living place. People built their homes
            here, faith was part of daily life, and many temples rose among
            the trees. Sages and holy men walked its paths.
          </p>
          <p className={p}>
            In time the people were gone, and the forest was left alone. Great
            stone statues were wrapped by roots and covered in moss. Nature
            did not destroy them. It reshaped them, slowly.
          </p>
          <p className={quote}>Nothing was lost. It was taken back.</p>
        </Split>

        {/* 5. Sunken temples */}
        <section className="bg-[#0b241b]">
          <img
            src={IMG + "ltc-7.png"}
            alt="Ancient temple ruins beneath the water, covered in moss"
            loading="lazy"
            className="block w-full h-auto"
          />
          <div className="px-[6vw] py-14 md:py-20 text-center">
            <h2 className={`${h2} mx-auto`}>The Temples Beneath the Water</h2>
            <p className={`${p} mx-auto`}>
              Not every temple stayed above ground. Some sank beneath rising
              water, and the forest followed them down. Moss and weed settled
              over carved stone, and light now reaches them only in broken
              rays.
            </p>
            <p className={`${quote} mt-6`}>Even here, beauty remains.</p>
          </div>
        </section>

        {/* 6. Where the collection begins: logo + text */}
        <Split img="ltc-8.png" alt="PlayBold Lost Temple Collection logo carved in stone" bg="bg-[#14503c]" flip>
          <h2 className={h2}>Where the Collection Begins</h2>
          <p className={p}>
            This is where the spirit of the Lost Temple Collection begins.
            Inspired by forgotten places, ancient structures, rugged
            landscapes and the untamed forest, it brings that mysterious world
            into PlayBold footwear.
          </p>
          <p className={p}>
            The idea is not to recreate an ancient place, but to capture the
            feeling of discovering something that was never meant to be easily
            found.
          </p>
        </Split>

        {/* 7. The guardian */}
        <Split img="ltc-9.jpg" alt="A tiger standing among ancient temple pillars">
          <h2 className={h2}>The Guardian of the Ruins</h2>
          <p className={p}>
            Where the forest keeps its secrets, something strong keeps watch.
            The tiger, our symbol of strength, walks among the ruins as the
            keeper of the forgotten place.
          </p>
          <p className={p}>
            Every design carries a piece of that journey: the strength of
            weathered stone, the texture of the wilderness, the freedom of
            unexplored trails, and the mystery of a world hidden beyond the
            familiar.
          </p>
        </Split>

        {/* 8. Details strip */}
        <section className="bg-[#14503c]">
          <div className="px-[6vw] py-16 md:py-20">
            <h2 className={h2}>Details from the Ruins</h2>
            <p className="max-w-[62ch]">
              Four small things from the forgotten place that shape how the
              collection looks and feels.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {details.map((d) => (
              <figure key={d.title} className="relative aspect-[3/4] overflow-hidden m-0">
                <img
                  src={IMG + d.img}
                  alt={d.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 px-5 pt-16 pb-5 bg-gradient-to-t from-[#0b241b]/95 to-transparent">
                  <b className="block font-serif text-lg text-[#a6d98f]">{d.title}</b>
                  <span className="text-sm text-[#e6f4e8]">{d.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 9. Beyond the ruins */}
        <Split img="ltc-14.jpg" alt="A waterfall beside a temple covered in vines">
          <h2 className={h2}>Beyond the Ruins</h2>
          <p className={p}>
            As the path continues past the temple, the wilderness becomes
            wider and the possibilities become endless. The ruins may tell us
            where the journey has been, but the trail ahead tells us where it
            could go next.
          </p>
          <p className={p}>
            Lost Temple is not only about a forgotten place. It is about the
            instinct to explore what lies beyond it.
          </p>
          <p className={quote}>
            The journey does not end at the temple. It begins there.
          </p>
        </Split>

        {/* 10. Closing */}
        <Overlay img="ltc-15.jpg" alt="A hidden temple beside a misty waterfall">
          <h2 className="font-serif text-[#e6f4e8] text-3xl md:text-5xl leading-tight mb-8">
            Discover the Lost Temple Collection
          </h2>
          <a
            href="/collections"
            className="inline-block px-9 py-3.5 bg-[#a6d98f] text-[#0b241b] font-semibold border-2 border-[#a6d98f] hover:bg-transparent hover:text-[#a6d98f] transition-colors"
          >
            Explore the collection
          </a>
          <p className="mt-8 text-sm italic text-[#b9d9c4]">by PlayBold</p>
        </Overlay>
      </main>
      <Footer />
    </div>
  );
};

export default LostTempleCollection;