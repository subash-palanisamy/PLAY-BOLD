// /**
//  * filterUtils.js
//  * Utility functions to filter and sort products.
//  *
//  * Usage:
//  *   import { filterByGender, filterByBrand, filterByCategory, filterByPrice, filterByDiscount, sortProducts } from '../utils/filterUtils';
//  */

// /**
//  * Filter by gender.
//  * Example: filterByGender(allProducts, "men")
//  */
// export function filterByGender(products, gender) {
//   return products.filter((p) => p.gender === gender);
// }

// /**
//  * Filter by brand (case-insensitive).
//  * Example: filterByBrand(products, "PUMA")
//  */
// export function filterByBrand(products, brand) {
//   return products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
// }

// /**
//  * Filter by category (matches last breadcrumb segment, case-insensitive).
//  * Example: filterByCategory(products, "Running")
//  */
// export function filterByCategory(products, category) {
//   return products.filter((p) => {
//     const last = p.breadcrumb[p.breadcrumb.length - 1];
//     return last?.toLowerCase() === category.toLowerCase();
//   });
// }

// /**
//  * Filter by price range (inclusive).
//  * Example: filterByPrice(products, 0, 10000)
//  */
// export function filterByPrice(products, min, max) {
//   return products.filter((p) => {
//     if (p.price === null) return false;
//     return p.price >= min && p.price <= max;
//   });
// }

// /**
//  * Filter only discounted products.
//  * Example: filterByDiscount(products)
//  */
// export function filterByDiscount(products) {
//   return products.filter((p) => p.discount !== null);
// }

// /**
//  * Filter by multiple brands at once.
//  * Example: filterByBrands(products, ["PUMA", "Nike"])
//  */
// export function filterByBrands(products, brands) {
//   const lower = brands.map((b) => b.toLowerCase());
//   return products.filter((p) => lower.includes(p.brand.toLowerCase()));
// }

// /**
//  * Sort products.
//  * sortBy: "price-asc" | "price-desc" | "discount" | "name"
//  * Example: sortProducts(products, "price-asc")
//  */
// export function sortProducts(products, sortBy) {
//   const sorted = [...products];
//   switch (sortBy) {
//     case "price-asc":
//       return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
//     case "price-desc":
//       return sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
//     case "discount":
//       return sorted.sort((a, b) => {
//         const aVal = a.originalPrice && a.price ? a.originalPrice - a.price : 0;
//         const bVal = b.originalPrice && b.price ? b.originalPrice - b.price : 0;
//         return bVal - aVal;
//       });
//     case "name":
//       return sorted.sort((a, b) => a.name.localeCompare(b.name));
//     default:
//       return sorted;
//   }
// }

export const filterProducts = (
  products,
  filters
) => {
  return products.filter((product) => {
    const genderMatch =
      !filters.gender ||
      product.gender === filters.gender;

    const categoryMatch =
      !filters.category ||
      product.category === filters.category;

    const sportMatch =
      !filters.sport ||
      product.sport === filters.sport;

    return (
      genderMatch &&
      categoryMatch &&
      sportMatch
    );
  });
};