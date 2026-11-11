import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());

app.use(express.json());

// static images
app.use(
  "/images",
  express.static("public/images")
);

// routes
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);
// test route
app.get("/", (req, res) => {
  res.send("PLAY BOLD API RUNNING 🚀");
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});