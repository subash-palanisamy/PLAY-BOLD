import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";

// ASSUMPTION: adjust to your real field (isSale / discount / originalPrice)
const isOnSale = (p) =>
  p.discountPrice != null && Number(p.discountPrice) < Number(p.price);

export default function SaleListing() {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Sale</h1>
        <ProductGrid all filter={isOnSale} />
      </div>
      <Footer />
    </div>
  );
}