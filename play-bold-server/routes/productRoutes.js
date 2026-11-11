import express from "express";
import allProducts from "../data/products/allProducts.js";
import {
  getAllProducts,
  getProductsByGenderCategory,
  getProductsByGenderSport,
  getSingleProduct,
} from "../controllers/productController.js";

const router = express.Router();

/* =========================
   SPECIFIC ROUTES FIRST
   ========================= */

// All products
router.get("/", getAllProducts);

// All shoes for a gender (used by Home.jsx ProductGrid)
router.get("/collection/:gender/:category", getProductsByGenderCategory);

// Sport-wise listing (used by Nav → /men/running)
router.get("/listing/:gender/:sport", getProductsByGenderSport);

/* =========================
   PRODUCT DETAIL ROUTES
   (dynamic params LAST, longer path first)
   ========================= */

// With collection: /men/running/nitro-collection/air-max-90
router.get("/:gender/:sport/:collection/:slug", getSingleProduct);

// Without collection: /men/running/air-max-90
router.get("/:gender/:sport/:slug", getSingleProduct);

export default router;