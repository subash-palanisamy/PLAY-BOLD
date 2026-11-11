import Cart from "../models/Cart.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // set by protect middleware
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("getCart error:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// POST /api/cart
// body: { productId, size, quantity }
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: "productId and size are required" });
    }

    const qtyToAdd = quantity && quantity > 0 ? quantity : 1;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += qtyToAdd;
    } else {
      cart.items.push({ productId, size, quantity: qtyToAdd });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PUT /api/cart
// body: { productId, size, quantity }  -> sets quantity directly (used by +/- steppers)
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({ message: "productId, size and quantity are required" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId === productId && item.size === size
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // treat 0 or negative as removal
      cart.items = cart.items.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// DELETE /api/cart/:productId/:size
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId === productId && item.size === size)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("clearCart error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};