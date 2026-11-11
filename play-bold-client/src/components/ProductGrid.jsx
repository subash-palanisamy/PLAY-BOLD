import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const API = "http://localhost:5000/api/products";

// Accepts either:
//   sport="training"                 → single fetch
//   sports={["training","trekking"]} → one fetch per sport, merged, de-duped
//   all                              → every product (for New / Sale / Collections)
//   filter={(p) => ...}              → client-side filter applied after fetch
function ProductGrid({ gender, category, sport, sports, picks, all, filter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sportList = sports && sports.length ? sports : sport ? [sport] : null;

  useEffect(() => {
    fetchProducts();
    // `filter` is intentionally NOT a dependency (new function each render).
    // It's applied at render time below.
  }, [gender, category, sport, all, JSON.stringify(sports), JSON.stringify(picks)]);

  const dedupe = (list) => {
    const seen = new Set();
    return list.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let data = [];

      if (all) {
        // Needs GET /api/products on the backend (see note below)
        const res = await fetch(API);
        data = await res.json();
      } else if (sportList) {
        const results = await Promise.all(
          sportList.map((s) =>
            fetch(`${API}/listing/${gender}/${s}`).then((res) => res.json())
          )
        );
        data = dedupe(results.flat());
      } else {
        const res = await fetch(`${API}/collection/${gender}/${category}`);
        data = await res.json();
      }

      // If specific IDs given, filter + keep exact order
      if (picks && picks.length) {
        data = picks
          .map((num) =>
            data.find((p) => parseInt(p.id.replace(/\D/g, ""), 10) === num)
          )
          .filter(Boolean);
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1 className="text-center text-2xl font-bold">Loading...</h1>;
  }

  const visible = filter ? products.filter(filter) : products;

  if (visible.length === 0) {
    return (
      <p className="text-center text-gray-500 py-16">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {visible.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;