import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";

// Defined outside the component so it isn't recreated every render
const isNewProduct = (p) => p.isNew === true;

export default function NewListing() {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">New Arrivals</h1>
        <ProductGrid all filter={isNewProduct} />
      </div>
      <Footer />
    </div>
  );
}