// /**
//  * slugUtils.js
//  * Utility functions to work with product slugs and URL paths.
//  *
//  * Usage:
//  *   import { getProductUrl, getProductFromSlug, generateSlug } from '../utils/slugUtils';
//  */

// /**
//  * Returns the full URL path for a product page.
//  * Example: "/men/shoes/running/puma-aston-martin-f1"
//  */
// export function getProductUrl(product) {
//   const gender = product.gender;
//   const category = product.breadcrumb[3]?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ?? "shoes";
//   return `/${gender}/shoes/${category}/${product.slug}`;
// }

// /**
//  * Generates a slug from any string (fallback if slug field is missing).
//  * Example: "PUMA x Aston Martin F1 Sneakers" → "puma-x-aston-martin-f1-sneakers"
//  */
// export function generateSlug(str) {
//   return str
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-");
// }

// /**
//  * Finds a product by its slug from a products array.
//  * Example: getProductFromSlug(menProducts, "puma-aston-martin-f1")
//  */
// export function getProductFromSlug(products, slug) {
//   return products.find((p) => p.slug === slug) ?? null;
// }

// /**
//  * Returns the image base path for a product.
//  * Example: "images/men/puma-aston-martin-f1"
//  */
// export function getImageBasePath(product) {
//   return `images/${product.gender}/${product.slug}`;
// }