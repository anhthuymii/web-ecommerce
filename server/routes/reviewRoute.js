import express from "express";
import {
  createProductReview,
  // createReview,
  deleteReview,
  getAllProductsInUserOrders,
  getAllReviews,
  getAllReviewsByProduct,
  getReviewById,
  // getReview,
  // getReviewsByProduct,
  getReviewsByUser,
  reviewPhotoController,
  updateProductReview,
  // uploadReviewPhoto,
} from "../controllers/reviewController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidableMiddleware from "express-formidable";
const router = express.Router();

router.post(
  "/create-product-review/:orderId/:productId",
  requireSignIn,
  formidableMiddleware(),
  createProductReview
);
// router.put(
//   "/update-product-review/:orderId/:productId",
//   requireSignIn,
//   formidableMiddleware(),
//   updateProductReview
// );

router.put(
  "/update-product-review/:reviewId",
  requireSignIn,
  formidableMiddleware(),
  updateProductReview
);

router.get("/get-all-reviews", getAllReviews);
router.get("/get-review/:reviewId", getReviewById);
router.get("/photo-review/:reviewId", reviewPhotoController);
router.get("/get-product-reviews/:productId", getAllReviewsByProduct);
router.get("/get-user-reviews/:userId", getReviewsByUser);
router.delete("/delete-review/:reviewId", deleteReview);

router.get("/get-all-products-in-user-orders/:userId",requireSignIn, getAllProductsInUserOrders)

export default router;
