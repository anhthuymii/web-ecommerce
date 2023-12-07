import reviewModel from "../models/reviewModel.js";
import multer from "multer";
import fs from "fs";
import formidable from "express-formidable";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

//create review product
export const createProductReview = async (req, res) => {
  try {
    const { comment, star } = req.fields;
    const { limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const orderId = req.params.orderId.trim();
    const userId = req.user?._id;
    const productId = req.params.productId.trim();
    const { files } = req;
    console.log("orderId:", orderId);
    console.log("productId:", productId);
    console.log("req.user:", req.user);
    console.log("userId:", userId);

    if (!orderId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đủ thông tin đánh giá",
      });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("products.product")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    if (!order || !order.products || order.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại hoặc không có sản phẩm",
      });
    }

    const userInfo =
      order.orderby && order.orderby.toString() === userId ? order : undefined;
    console.log("userInfo:", userInfo);

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng trong đơn hàng",
      });
    }

    const productInOrder = order.products.find(
      (product) => product.product._id.toString() === productId
    );

    if (!productInOrder) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại trong đơn hàng",
      });
    }

    if (order.orderby.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền đánh giá sản phẩm trong đơn hàng này",
      });
    }

    if (
      !order.orderStatus ||
      order.orderStatus.toLowerCase() !== "đã giao hàng"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn chỉ có thể đánh giá sản phẩm trong đơn hàng đã giao hàng",
      });
    }

    const existingReview = await reviewModel.findOne({
      user: userId,
      "orders.order": orderId,
      "orders.products._id": productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này trước đó",
      });
    }

    // Check if there is any existing review for the specific product within the order
    const existingProductReview = await reviewModel.findOne({
      "orders.order": orderId,
      "orders.products._id": productId,
    });

    if (existingProductReview) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm này trong đơn hàng đã được đánh giá trước đó",
      });
    }

    if (files && files.reviewPhoto && files.reviewPhoto.size > 1000000) {
      return res
        .status(500)
        .send({ error: "Ảnh bắt buộc và phải nhỏ hơn 1MB" });
    }

    const newReview = new reviewModel({
      comment,
      star,
      user: {
        id: userId,
        name: userInfo.name,
        phone: userInfo.phone,
      },
      orders: [
        {
          order: orderId,
          products: [
            {
              _id: productId,
              name: productInOrder.product.name,
              size: productInOrder.size,
              quantity: productInOrder.quantity,
              price: productInOrder.price,
              slug: productInOrder.slug,
            },
          ],
        },
      ],
      reviewPhoto: [],
    });

    if (files && files.reviewPhoto) {
      const photoData = {
        data: fs.readFileSync(files.reviewPhoto.path),
        contentType: files.reviewPhoto.type,
      };

      newReview.reviewPhoto.push(photoData);
    }

    await newReview.save();
    const totalProductReview = await reviewModel.countDocuments({
      "orders.order": orderId,
      "orders.products._id": productId,
    });
    res.status(201).json({
      success: true,
      countTotal: order.length,
      total: totalProductReview,
      currentPage: parseInt(page),
      message: "Thêm đánh giá sản phẩm thành công",
      newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Lỗi xảy ra khi thêm đánh giá sản phẩm",
    });
  }
};

// Update review
export const updateProductReview = async (req, res) => {
  try {
    const { comment, star } = req.fields;
    const userId = req.user?._id;
    const reviewId = req.params.reviewId;
    if (!userId || !reviewId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đủ thông tin để cập nhật đánh giá",
      });
    }

    const existingReview = await reviewModel.findById(reviewId);

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá để cập nhật",
      });
    }

    if (existingReview.user.id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật đánh giá này",
      });
    }

    existingReview.comment = comment || existingReview.comment;
    existingReview.star = star || existingReview.star;

    const { files } = req;
    if (files && files.reviewPhoto && files.reviewPhoto.size > 1000000) {
      return res.status(500).send({ error: "Ảnh phải nhỏ hơn 1MB" });
    }

    if (files && files.reviewPhoto) {
      existingReview.reviewPhoto = [];

      const photoData = {
        data: fs.readFileSync(files.reviewPhoto.path),
        contentType: files.reviewPhoto.type,
      };

      existingReview.reviewPhoto.push(photoData);
    }

    await existingReview.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá sản phẩm thành công",
      updatedReview: existingReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Lỗi xảy ra khi cập nhật đánh giá sản phẩm",
    });
  }
};

//update review
// export const updateProductReview = async (req, res) => {
//   try {
//     const { comment, star } = req.fields;
//     const userId = req.user?._id;
//     const productId = req.params.productId;
//     const orderId = req.params.orderId;

//     if (!userId || !productId || !orderId) {
//       return res.status(400).json({
//         success: false,
//         message: "Vui lòng nhập đủ thông tin để cập nhật đánh giá",
//       });
//     }

//     const existingReview = await reviewModel.findOne({
//       user: userId,
//       "orders.order": orderId,
//       "orders.products._id": productId,
//     });

//     if (!existingReview) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy đánh giá để cập nhật",
//       });
//     }

//     // Update review fields
//     existingReview.comment = comment || existingReview.comment;
//     existingReview.star = star || existingReview.star;

//     // Update review photos
//     const { files } = req;
//     if (files && files.reviewPhoto && files.reviewPhoto.size > 1000000) {
//       return res.status(500).send({ error: "Ảnh phải nhỏ hơn 1MB" });
//     }

//     if (files && files.reviewPhoto) {
//       const photoData = {
//         data: fs.readFileSync(files.reviewPhoto.path),
//         contentType: files.reviewPhoto.type,
//       };

//       existingReview.reviewPhoto.push(photoData);
//     }

//     // Save the updated review
//     await existingReview.save();

//     res.status(200).json({
//       success: true,
//       message: "Cập nhật đánh giá sản phẩm thành công",
//       updatedReview: existingReview,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error,
//       message: "Lỗi xảy ra khi cập nhật đánh giá sản phẩm",
//     });
//   }
// };

//get review all product
export const getAllReviews = async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    let filter = {};

    const reviews = await reviewModel
      .find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    const totalReviews = await reviewModel.countDocuments();

    res.status(200).json({
      success: true,
      countTotal: reviews.length,
      total: totalReviews,
      currentPage: parseInt(page),
      message: "All Reviews",
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Lỗi xảy ra khi lấy đánh giá",
    });
  }
};

//get review 1 product
export const getAllReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await reviewModel
      .find({ "orders.products._id": productId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalReviews = await reviewModel.countDocuments({
      "orders.products._id": productId,
    });

    res.status(200).json({
      success: true,
      countTotal: reviews.length,
      total: totalReviews,
      currentPage: parseInt(page),
      message: "All reviews for the specified product",
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error retrieving reviews by product ID",
    });
  }
};

// get review product by user
export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await reviewModel
      .find({ "user.id": userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const orderIds = reviews.flatMap((review) =>
      review.orders.map((order) => order.order)
    );

    const uniqueOrderIds = [...new Set(orderIds)];

    const products = await productModel.find({
      "orders.order": { $in: uniqueOrderIds },
    });
    const totalProductReviews = await reviewModel.countDocuments({
      "user.id": userId,
    });

    res.status(200).json({
      success: true,
      countTotal: reviews.length,
      total: totalProductReviews,
      currentPage: parseInt(page),
      message: "All reviews of the user",
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error retrieving reviews of the user",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const existingReview = await reviewModel.findById(reviewId);

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Đánh giá không tồn tại",
      });
    }

    // console.log("req.user._id:", req.user._id);
    // console.log(
    //   "existingReview.user.id.toString():",
    //   existingReview.user.id.toString()
    // );

    // Ensure both values are converted to strings for direct comparison
    // if (existingReview.user.id.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Bạn không có quyền xóa đánh giá này",
    //   });
    // }

    await existingReview.deleteOne();
    res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Lỗi xảy ra khi xóa đánh giá",
    });
  }
};

// get single review by ID
export const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error retrieving review by ID",
    });
  }
};

//review photo
export const reviewPhotoController = async (req, res) => {
  try {
    const review = await reviewModel
      .findById(req.params.reviewId)
      .select("reviewPhoto");

    if (review && review.reviewPhoto && review.reviewPhoto.length > 0) {
      // Assuming you want to send the first photo. You can modify this based on your requirements.
      const firstPhoto = review.reviewPhoto[0];

      res.set("Content-type", firstPhoto.contentType);
      return res.status(200).send(firstPhoto.data);
    } else {
      return res
        .status(404)
        .send({ success: false, message: "Review photo not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting review photo",
      error,
    });
  }
};

export const getAllProductsInUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find orders with status "Đã giao hàng" for the given user
    const deliveredOrders = await orderModel
      .find({
        orderby: userId,
        orderStatus: "Đã giao hàng",
      })
      .select("_id");

    // Extract order IDs from the delivered orders
    const deliveredOrderIds = deliveredOrders.map((order) => order._id);

    // Find products associated with the delivered orders
    const productsInUserOrders = await productModel.find({
      "orders.order": { $in: deliveredOrderIds },
    });

    res.status(200).json({
      success: true,
      message: "Products in user's delivered orders retrieved successfully",
      products: productsInUserOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error retrieving products in user's delivered orders",
    });
  }
};


