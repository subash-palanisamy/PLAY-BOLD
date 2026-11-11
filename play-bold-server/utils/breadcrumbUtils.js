// /**
//  * breadcrumbUtils.js
//  * Utility functions to work with product breadcrumb paths.
//  * 
//  * Usage:
//  *   import { getBreadcrumbString, getBreadcrumbArray, getBreadcrumbWithProduct } from '../utils/breadcrumbUtils';
//  */

// /**
//  * Returns breadcrumb as a display string.
//  * Example: "Home › Men › Shoes › Running › Nitro Collection"
//  */
// export function getBreadcrumbString(product, separator = " › ") {
//   if (!product?.breadcrumb?.length) return "Home";
//   return product.breadcrumb.join(separator);
// }

// /**
//  * Returns breadcrumb array (for building nav links).
//  * Example: ["Home", "Men", "Shoes", "Running", "Nitro Collection"]
//  */
// export function getBreadcrumbArray(product) {
//   if (!product?.breadcrumb?.length) return ["Home"];
//   return product.breadcrumb;
// }

// /**
//  * Returns breadcrumb array including the product name at the end.
//  * Example: ["Home", "Men", "Shoes", "Running", "Nitro Collection", "PUMA x Aston Martin..."]
//  */
// export function getBreadcrumbWithProduct(product) {
//   if (!product?.breadcrumb?.length) return ["Home", product.name];
//   return [...product.breadcrumb, product.name];
// }

// /**
//  * Returns breadcrumb as an array of objects with label and path.
//  * Useful for rendering clickable breadcrumb links.
//  * 
//  * Example output:
//  * [
//  *   { label: "Home",             path: "/home" },
//  *   { label: "Men",              path: "/home/men" },
//  *   { label: "Shoes",            path: "/home/men/shoes" },
//  *   { label: "Running",          path: "/home/men/shoes/running" },
//  *   { label: "Nitro Collection", path: "/home/men/shoes/running/nitro-collection" },
//  * ]
//  */
// export function getBreadcrumbLinks(product) {
//   const crumbs = getBreadcrumbArray(product);
//   return crumbs.map((label, index) => ({
//     label,
//     path:
//       "/" +
//       crumbs
//         .slice(0, index + 1)
//         .map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
//         .join("/"),
//   }));
// }

export const buildBreadcrumb = (product) => {
  return [
    {
      label: "Home",
      path: "/",
    },

    {
      label:
        product.gender.charAt(0).toUpperCase() +
        product.gender.slice(1),

      path: `/${product.gender}`,
    },

    {
      label:
        product.category.charAt(0).toUpperCase() +
        product.category.slice(1),

      path: `/${product.gender}/${product.category}`,
    },

    {
      label:
        product.sport.charAt(0).toUpperCase() +
        product.sport.slice(1),

      path: `/${product.gender}/${product.category}/${product.sport}`,
    },

    {
      label: product.name,
      path: null,
    },
  ];
};