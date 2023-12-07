import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
// import { verify } from "jsonwebtoken";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getAllUserOrder,
  getDeliveredProductsForUser,
  singleUserOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
const router = express.Router();

// router.get("/", getOrder);

router.post("/create-order", requireSignIn, createOrder);

router.get("/get-user-order/:userId", requireSignIn, getAllUserOrder);

// router.get("/get-user-order-by-status/:userId", requireSignIn, getUserOrdersByStatus);

router.get("/get-orders", getAllOrders);

router.get("/get-order/:id", singleUserOrder);

router.put("/cancel-order/:id", cancelOrder);

router.delete("/delete-order/:id", requireSignIn, isAdmin, deleteOrder);

router.put("/update-order/:id", requireSignIn, isAdmin, updateOrderStatus);

// router.put("/pay", requireSignIn, updateOrderUser)

// router.get("/newOrderForCurrentUser", requireSignIn, getNewOrderForCurrentUser)

router.get("/get-delivered-products/:userId", getDeliveredProductsForUser);

export default router;
