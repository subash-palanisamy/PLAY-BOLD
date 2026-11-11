const KEY = "playbold_recently_viewed";
const MAX_ITEMS = 8;

export const getRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (product) => {
  if (!product) return;
  const id = product.id ?? product._id;
  if (!id) return;

  const entry = {
    id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    discountPrice: product.discountPrice,
    image: product.images?.[0],
    gender: product.gender,
    sport: product.sport,
    slug: product.slug,
    collection: product.collection,
  };

  try {
    const rest = getRecentlyViewed().filter((p) => p.id !== id);
    localStorage.setItem(KEY, JSON.stringify([entry, ...rest].slice(0, MAX_ITEMS)));
  } catch (err) {
    console.error("Recently viewed save error:", err.message);
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};