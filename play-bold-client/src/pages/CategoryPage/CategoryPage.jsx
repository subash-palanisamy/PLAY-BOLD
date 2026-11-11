// src/pages/CategoryPage/CategoryPage.jsx
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";

const GENDER_LABELS = {
  men: "Men's Shoes",
  women: "Women's Shoes",
  kids: "Kids Shoes",
};

function CategoryPage() {
  const { gender } = useParams(); // from route: /:gender/shoes

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">
            {GENDER_LABELS[gender] || "Shoes"}
          </h1>
          <ProductGrid gender={gender} category="shoes" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CategoryPage;