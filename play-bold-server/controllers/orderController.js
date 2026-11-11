import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

// ─────────────────────────────────────────────────────────
// FAKE SHIPMENT TRACKING
// No real courier API is used. Each order's timeline is
// derived purely from its createdAt timestamp using fixed
// offsets, so it "progresses" automatically over real time
// without any admin/manual updates.
// ─────────────────────────────────────────────────────────

const TRACKING_STEPS = [
  { key: "Received", offsetHours: 0 },
  { key: "Picked", offsetHours: 6 },
  { key: "In-transit", offsetHours: 18 },
  { key: "Out for delivery", offsetHours: 30 },
  { key: "Delivered", offsetHours: 36 },
];

function generateTrackingId() {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `PB${Date.now().toString().slice(-6)}${random}`;
}

function buildTracking(order) {
  if (order.orderStatus === "Cancelled") {
    return { cancelled: true, steps: [], currentStatus: "Cancelled", eta: null };
  }

  const now = Date.now();
  const createdAt = new Date(order.createdAt).getTime();
  const city = order.shippingAddress?.city || "your city";

  const locations = {
    Received: "Warehouse, Chennai",
    Picked: "Sorting Hub, Chennai",
    "In-transit": "Transit Hub, Bangalore",
    "Out for delivery": city,
    Delivered: city,
  };

  const steps = TRACKING_STEPS.map((s) => {
    const timestamp = new Date(createdAt + s.offsetHours * 60 * 60 * 1000);
    return {
      label: s.key,
      location: locations[s.key],
      timestamp,
      completed: now >= timestamp.getTime(),
    };
  });

  let currentIndex = 0;
  steps.forEach((s, idx) => {
    if (s.completed) currentIndex = idx;
  });

  const isDelivered = steps[steps.length - 1].completed;

  return {
    cancelled: false,
    steps,
    currentStatus: isDelivered ? "Delivered" : steps[currentIndex].label,
    eta: isDelivered ? null : "Arriving Soon",
  };
}

// POST /api/orders
// body: { addressId, paymentMethod }
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, paymentMethod } = req.body;

    if (!addressId || !paymentMethod) {
      return res.status(400).json({ message: "addressId and paymentMethod are required" });
    }

    const validMethods = ["COD", "UPI", "Card", "NetBanking"];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // get shipping address from user's saved addresses
    const user = await User.findById(userId);
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // fetch product details to build order item snapshots
    // reuse the products data via internal fetch is not ideal here,
    // so we expect the frontend to send enriched cart items for pricing safety.
    // Instead, we rely on req.body.items sent from frontend (validated against cart).
    const { items } = req.body; // [{ productId, size, quantity, name, image, brand, price }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // cross-check items against cart (basic integrity check)
    const cartMap = new Map(
      cart.items.map((i) => [`${i.productId}_${i.size}`, i.quantity])
    );

    for (const item of items) {
      const key = `${item.productId}_${item.size}`;
      if (!cartMap.has(key) || cartMap.get(key) !== item.quantity) {
        return res.status(400).json({
          message: "Order items do not match your current cart. Please refresh and try again.",
        });
      }
    }

    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = 0; // free shipping for now
    const totalAmount = itemsTotal + shippingFee;

    const order = await Order.create({
      userId,
      items,
      shippingAddress: {
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
      },
      paymentMethod,
      paymentStatus: "Pending", // COD and all other methods start Pending; real gateway will update this later
      itemsTotal,
      shippingFee,
      totalAmount,
      trackingId: generateTrackingId(),
      courierName: "Ecom Express",
    });

    // clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // attach a lightweight current tracking status to each order for list display
    const withStatus = orders.map((order) => {
      const tracking = buildTracking(order);
      return {
        ...order.toObject(),
        trackingStatus: tracking.currentStatus,
      };
    });

    res.status(200).json(withStatus);
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const tracking = buildTracking(order);

    res.status(200).json({
      ...order.toObject(),
      tracking,
    });
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Order cannot be cancelled once it is ${order.orderStatus.toLowerCase()}`,
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("cancelOrder error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};