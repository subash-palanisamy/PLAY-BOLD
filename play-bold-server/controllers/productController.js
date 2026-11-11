import allProducts from "../data/products/allProducts.js";

export const getAllProducts = (req, res) => {
  res.json(allProducts);
};

export const getProductsByGenderCategory = (req, res) => {
  const { gender, category } = req.params;

  const filtered = allProducts.filter(
    (p) => p.gender === gender && p.category === category
  );

  res.json(filtered);
};

export const getProductsByGenderSport = (req, res) => {
  const { gender, sport } = req.params;

  const filtered = allProducts.filter(
    (p) => p.gender === gender && p.sport === sport
  );

  res.json(filtered);
};

export const getSingleProduct = (req, res) => {
  const { gender, sport, collection, slug } = req.params;

  const product = allProducts.find((p) => {
    const genderMatch = p.gender === gender;
    const sportMatch = p.sport === sport;
    const slugMatch = p.slug === slug;

    if (collection) {
      const collectionSlug = p.collection
        ? p.collection.toLowerCase().replace(/\s+/g, "-")
        : null;
      return genderMatch && sportMatch && slugMatch && collectionSlug === collection;
    }

    return genderMatch && sportMatch && slugMatch && !p.collection;
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};