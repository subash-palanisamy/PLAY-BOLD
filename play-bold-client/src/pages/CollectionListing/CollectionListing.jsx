import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";

const slugify = (str = "") =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Slug -> display title (navbar options)
const TITLES = {
  "air-force-1": "Air Force 1",
  rcb: "RCB",
  pixar: "Pixar",
  "ranveer-singh": "Ranveer Singh",
};

export default function CollectionListing() {
  const { collection } = useParams(); // undefined on /collections

  const filter = collection
    ? (p) => slugify(p.collection) === collection
    : (p) => Boolean(p.collection); // /collections → every collection product

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">
          {collection ? TITLES[collection] || collection.replace(/-/g, " ") : "Collections"}
        </h1>
        {/* key forces a clean re-render when switching between collections */}
        <ProductGrid key={collection || "all"} all filter={filter} />
      </div>
      <Footer />
    </div>
  );
}