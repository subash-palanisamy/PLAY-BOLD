import menProducts from "./menProducts.js";
import womenProducts from "./womenProducts.js";
import kidsProducts from "./kidsProducts.js"
import specialCollections from "./specialCollections.js"

const allProducts = [
  ...menProducts,
  ...womenProducts,
  ...kidsProducts,
  ...specialCollections,
];

export default allProducts;