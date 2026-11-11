import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js"; // adjust path/name if different

const router = express.Router();

router.use(protect); // all cart routes require auth

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId/:size", removeFromCart);
router.delete("/clear", clearCart);

export default router;