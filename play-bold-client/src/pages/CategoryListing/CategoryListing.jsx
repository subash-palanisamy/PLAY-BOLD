import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGrid from "../../components/ProductGrid";

const SPORT_GROUPS = {
  "training-outdoor": ["training", "trekking"],
  "training-gym": ["training"],
  "walking-lifestyle": ["walking", "sportswear", "motorsport"],
  "court-sports": ["basketball", "badminton"],
  "slip-ons-sandals": ["slip-ons", "sandals"],
  "basketball-indoor": ["basketball", "indoor sports"],
  "sneakers": ["sneakers", "casual"],
};

function CategoryListing() {
  const { gender, sport } = useParams();
  const sportGroup = SPORT_GROUPS[sport];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold capitalize mb-8">
          {gender}'s {sport.replace(/-/g, " ")} Shoes
        </h1>

        {sportGroup ? (
          <ProductGrid gender={gender} sports={sportGroup} />
        ) : (
          <ProductGrid gender={gender} sport={sport} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CategoryListing;