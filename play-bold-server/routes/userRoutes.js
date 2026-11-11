import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/userController.js";

const router = express.Router();

// // test route
// router.get("/", (req, res) => {
//   res.send("User route working");
// });

// REGISTER
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PROFILE ───
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ─── PASSWORD ───
router.put("/change-password", protect, changePassword);

// ─── ADDRESSES ───
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.put("/addresses/:addressId/default", protect, setDefaultAddress);

export default router;