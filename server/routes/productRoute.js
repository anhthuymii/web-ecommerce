import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductController,
  getProductsByTagController,
  // getProductIdBySlugController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  // productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
  // updateProductQuantityController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update routes
// router.put(
//   "/update-product-quantity/:pid",
//   requireSignIn,
//   isAdmin,
//   formidable(),
//   updateProductQuantityController
// );

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

router.get("/product/:productId", getProductByIdController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
// router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

router.get("/products/related/:tag", getProductsByTagController);

// router.get("/products/tag/:tag", getProductsByTagController);

export default router;
