import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Palette: g1 #0b241b | g2 #14503c | g3 #1e7f5c | g4 #5db894 | g5 #a6d98f
// Text: #e6f4e8 (headings) | #b9d9c4 (paragraphs)
// All images are full-bleed: they touch the page edges (no side margins).

const IMG = "/images/banner/about/";

const symbols = [
  { name: "The Tiger", tag: "Strength", text: "Courage, resilience and a fearless spirit." },
  { name: "The Claw Marks", tag: "Power", text: "Determination and the drive to push forward." },
  { name: "The Circle", tag: "Focus", text: "Unity, purpose and a clear direction." },
];

const nature = [
  { image: "about-4.jpg", title: "The Upper", text: "Inspired by the wild. Patterns and textures shape its character." },
  { image: "about-5.jpg", title: "The Midsole", text: "Inspired by mountains. Layers for cushioning and support." },
  { image: "about-6.jpg", title: "The Outsole", text: "Inspired by rocks and roots. Built for grip on rough ground." },
  { image: "about-7.jpg", title: "The Details", text: "Inspired by leaves and flowing water. Texture with identity." },
];

const steps = [
  { title: "Research", text: "We study how you move, from mountain trails to city streets." },
  { title: "Material Innovation", text: "Lighter, stronger fabrics and kinder materials." },
  { title: "Design & Engineering", text: "Sketches become structure with support and flexibility." },
  { title: "Testing & Quality", text: "Flex, grip, durability and comfort tested for real use." },
  { title: "Final Product", text: "Design, materials and craft come together for your next adventure." },
];

const h2 = "font-serif text-[#e6f4e8] text-3xl md:text-5xl leading-tight";

const About = () => {
  return (
    <div>
      <Navbar />
      <main className="bg-[#0b241b] text-[#b9d9c4] font-sans overflow-x-hidden">
        {/* 0. Welcome */}
        <section className="px-[6vw] pt-16 md:pt-24 pb-12 md:pb-16 text-center">
          <h1 className="font-serif text-[#e6f4e8] text-4xl md:text-6xl leading-tight mb-6">
            Welcome to PlayBold
          </h1>
          <p className="leading-relaxed text-lg max-w-[60ch] mx-auto">
            PlayBold is a footwear brand born from the wild. Our ideas come
            from forests, mountains, rivers and the stories hidden in ancient
            ruins. Every pair is made to move with you, on trails, on streets
            and everywhere in between. Play bold, live bold, and let every
            step lead somewhere new.
          </p>
        </section>

        {/* 1 + 2. Our Story and Logo (one full-width image) */}
        <section className="bg-gradient-to-b from-[#0b241b] to-[#14503c]">
          <img
            src={IMG + "about-1.png"}
            alt="PlayBold story: an explorer on a mountain, and the tiger, claw marks and circle logo explained"
            className="block w-full h-auto"
          />
          <div className="px-[6vw] pt-12 md:pt-16 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h2 className={`${h2} mb-5`}>Born from a Bigger Purpose</h2>
              <p className="leading-relaxed max-w-[62ch] mb-4">
                PlayBold is inspired by exploration, the strength of nature,
                and the courage to move beyond the familiar. We believe every
                step has the power to lead somewhere new.
              </p>
              <p className="leading-relaxed max-w-[62ch] mb-4">
                From rugged mountains to hidden forest trails, nature gives us
                endless ideas for how a shoe can look, feel and perform.
              </p>
              <p className="leading-relaxed max-w-[62ch] mb-6">
                Our vision is to bring that spirit into every design, with
                footwear that reflects individuality, movement and confidence.
              </p>
              <p className="leading-relaxed max-w-[62ch] mb-6">
                What began as a dream to create purpose-driven shoes has grown
                into a brand for those who dare to go beyond the ordinary.
              </p>
              <p className="font-serif italic text-xl text-[#a6d98f]">
                Play Bold. Live Bold.
              </p>
            </div>
            <div>
              <h2 className={`${h2} mb-5`}>More Than Just a Symbol</h2>
              <p className="leading-relaxed mb-4">
                Our logo is a symbol of what PlayBold stands for. Three
                elements, each inspired by the wild, come together in one mark.
              </p>
              <ul>
                {symbols.map((s) => (
                  <li key={s.name} className="py-3 border-t border-[#1e7f5c]">
                    <span className="font-semibold text-[#a6d98f]">
                      {s.name}, {s.tag}.
                    </span>{" "}
                    {s.text}
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                Together, they express the spirit of PlayBold: strong in
                character, bold in action, and focused on moving forward. Our
                logo is more than a mark. It is a reminder to play bold and
                live bold.
              </p>
            </div>
          </div>
        </section>

        {/* 3. The forest behind PlayBold */}
        <section className="px-[6vw] py-16 md:py-24">
          <div className="max-w-[70ch] mb-12">
            <h2 className={`${h2} mb-4`}>A Forest Became Our Brand</h2>
            <p className="leading-relaxed">
              PlayBold did not begin in a design studio. It began with a
              forest, and everything living inside it: animals, trees and
              plants, rivers and streams, hills, rocks and fallen trunks. We
              looked at every part of this wild world and asked how it could
              be reflected in a shoe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <div className="pt-4 border-t-2 border-[#5db894]">
              <h3 className="font-serif text-2xl text-[#a6d98f] mb-3">
                A Forest That Was Once Home
              </h3>
              <p className="leading-relaxed">
                Long ago, this forest was a living place. People made their
                homes here, faith was part of daily life, and many temples rose
                among the trees. Sages and holy men walked its paths.
              </p>
            </div>
            <div className="pt-4 border-t-2 border-[#5db894]">
              <h3 className="font-serif text-2xl text-[#a6d98f] mb-3">
                Nature Took It Back
              </h3>
              <p className="leading-relaxed">
                In time the people were gone, and the forest was left alone.
                Roots wrapped around temple walls, moss covered great stone
                statues, and some temples even sank beneath the water. Nothing
                was destroyed in a day. Time and nature shaped it slowly.
              </p>
            </div>
            <div className="pt-4 border-t-2 border-[#5db894]">
              <h3 className="font-serif text-2xl text-[#a6d98f] mb-3">
                The Broken Temple Collection
              </h3>
              <p className="leading-relaxed">
                This is where the collection begins. Weathered stone, roots
                curling through cracks, carved figures softened by time. Every
                pair carries the story of something strong that nature
                reshaped instead of erased.
              </p>
            </div>
          </div>

          <p className="font-serif italic text-xl md:text-2xl text-[#a6d98f] mt-12 max-w-[40ch]">
            A complete wild forest, and everything in it, became the world of
            PlayBold.
          </p>
        </section>

        {/* 4. Design philosophy: images touch the page edges, text beside them */}
        <section className="bg-[#14503c]">
          <div className="px-[6vw] pt-16 md:pt-24 pb-12 max-w-[62ch] md:max-w-none">
            <h2 className={`${h2} mb-4 max-w-[24ch]`}>Inspired by Nature. Designed with Purpose.</h2>
            <p className="leading-relaxed max-w-[62ch]">
              Every detail has a reason. From the strength of a mountain to the
              pattern of a wild animal, nature shapes how we think about form,
              texture and structure. We turn these ideas into footwear concepts
              built around comfort, grip and character.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <img
              src={IMG + "about-2.png"}
              alt="Leopard and mountain inspired upper, midsole and outsole concepts"
              className="block w-full h-auto"
            />
            <div className="px-[6vw] md:px-14 py-12">
              <h3 className="font-serif text-[#e6f4e8] text-2xl md:text-4xl mb-4">
                Built Like the Mountains
              </h3>
              <p className="mb-4">
                Every concept starts as a sketch. From there it grows through
                layers, textures and shapes borrowed from the wild.
              </p>
              <p className="mb-3">
                <b className="text-[#a6d98f]">The Upper.</b> Leopard-inspired
                patterns bring agility, strength and individuality.
              </p>
              <p className="mb-3">
                <b className="text-[#a6d98f]">The Midsole.</b> Layered
                mountain forms inspire a structured midsole for cushioning and
                stability.
              </p>
              <p>
                <b className="text-[#a6d98f]">The Outsole.</b> Rocks, roots
                and trails inspire patterns made for grip and directional
                movement.
              </p>
              <p className="mt-4">
                Together, the upper, midsole and outsole work as one complete
                design, not three separate parts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="px-[6vw] md:px-14 py-12 order-2 md:order-1">
              <h3 className="font-serif text-[#e6f4e8] text-2xl md:text-4xl mb-4">
                Shaped by the Forest
              </h3>
              <p className="mb-4">
                Not every path is rocky. Some are soft, green and full of
                life, and they inspire a gentler side of PlayBold.
              </p>
              <p className="mb-3">
                <b className="text-[#a6d98f]">The Details.</b> Leaf
                structures, flowing water and tree forms give each concept its
                own identity.
              </p>
              <p className="mb-5">
                <b className="text-[#a6d98f]">The Upper.</b> A deer-inspired
                concept with soft leather overlays and floral textures, made
                for those who go further with grace.
              </p>
              <p className="mb-5">
                Premium leather, breathable mesh and reinforced overlays are
                explored for durability, airflow and added strength, with
                floral details inspired by the forest floor.
              </p>
              <p className="font-serif italic text-xl text-[#a6d98f]">
                Naturally elegant. Confidently forward.
              </p>
            </div>
            <img
              src={IMG + "about-3.png"}
              alt="Forest and deer inspired design concepts"
              className="block w-full h-auto order-1 md:order-2"
            />
          </div>
        </section>

        {/* 5. Nature strip: four photos edge to edge, no gaps */}
        <section>
          <div className="px-[6vw] py-16 md:py-20">
            <h2 className={`${h2} mb-3`}>Where the Ideas Begin</h2>
            <p className="max-w-[62ch]">
              Misty forests, mountain valleys, lost temples and hidden
              waterfalls are more than backdrops. They are where our shapes,
              textures and colours come from. Each place gives a different
              part of the shoe its character.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {nature.map((n) => (
              <figure key={n.title} className="relative aspect-[3/4] overflow-hidden m-0">
                <img
                  src={IMG + n.image}
                  alt={n.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 px-5 pt-16 pb-5 bg-gradient-to-t from-[#0b241b]/95 to-transparent">
                  <b className="block font-serif text-lg text-[#a6d98f]">{n.title}</b>
                  <span className="text-sm text-[#e6f4e8]">{n.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="px-[6vw] py-12 md:py-16 max-w-[70ch] font-serif italic text-xl text-[#a6d98f]">
            Walk through any of these places and you will see the same thing.
            Nothing in nature is there by accident. We design the same way.
          </p>
        </section>

        {/* 6. Concept to creation */}
        <section className="bg-[#14503c]">
          <div className="px-[6vw] pt-16 md:pt-24 pb-10">
            <h2 className={`${h2} mb-3`}>From Concept to Creation</h2>
            <p className="max-w-[62ch]">
              Every detail, one clear purpose. Here is how an idea from the
              wild becomes a finished shoe.
            </p>
            <p className="max-w-[62ch] mt-3">
              It starts with real people on real terrain, moves through
              materials, design and testing, and ends with a pair that is
              ready for your next adventure.
            </p>
          </div>
          <img
            src={IMG + "about-8.png"}
            alt="PlayBold process from research to final product"
            loading="lazy"
            className="block w-full h-auto"
          />
          <div className="px-[6vw] pt-10">
            <p className="font-serif italic text-xl md:text-2xl text-[#a6d98f]">
              Same spirit. New innovations.
            </p>
          </div>
          <ol className="px-[6vw] py-10 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="pt-3 border-t-2 border-[#5db894] text-sm">
                <span className="block font-serif text-2xl text-[#a6d98f]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <b className="block text-[#e6f4e8] mb-1">{s.title}</b>
                {s.text}
              </li>
            ))}
          </ol>
        </section>

        {/* 7. Closing band */}
        <section className="bg-[#1e7f5c] px-[6vw] py-16 md:py-24 text-center">
          <h2 className="font-serif text-[#0b241b] text-3xl md:text-5xl mb-3">
            Every Step Begins with a Choice
          </h2>
          <p className="text-[#0b241b] mx-auto max-w-[52ch] mb-8">
            Choose your path. Explore footwear inspired by movement,
            individuality and the spirit of the wild.
          </p>
          <a
            href="/collections"
            className="inline-block px-9 py-3.5 bg-[#0b241b] text-[#a6d98f] font-semibold border-2 border-[#0b241b] hover:bg-transparent hover:text-[#0b241b] transition-colors"
          >
            Shop the Collection
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;