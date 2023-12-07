import orderModel from "../models/orderModel.js";
import { validationResult } from "express-validator";
import userModel from "../models/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const {
      products,
      paymentIntent,
      orderby,
      phone,
      name,
      slug,
      reviews,
      star,
      comment,
      reviewPhoto,
      address,
      totalPrice,
      itemsPrice,
      shippingPrice,
    } = req.body;

    if (
      !products ||
      !paymentIntent ||
      !orderby ||
      !phone ||
      !name ||
      // !slug ||
      !address ||
      !totalPrice ||
      !itemsPrice ||
      !shippingPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Chưa đủ dữ liệu",
      });
    }

    if (
      !address.city ||
      !address.district ||
      !address.commune ||
      !address.detail
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập thêm địa chỉ giao hàng",
      });
    }

    const orderStatus = req.body.orderStatus || "Chờ xác nhận";
    // console.log(req.body);
    const orderData = {
      products,
      paymentIntent,
      orderStatus,
      orderby,
      phone,
      name,
      address,
      totalPrice,
      itemsPrice,
      shippingPrice,
    };

    const newOrder = new orderModel(orderData);

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Lỗi xảy ra khi tạo đơn hàng",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { orderStatus, receivedDate, limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (orderStatus) {
      filter = { orderStatus };
    }

    if (receivedDate) {
      const startOfDay = new Date(receivedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(receivedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      filter.receivedDate = {
        $gte: startOfDay,
        $lt: endOfDay,
      };
    }

    const orders = await orderModel
      .find(filter)
      // .populate("products.product.reviews")
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalOrder = await orderModel.countDocuments(filter);

    res.status(200).send({
      success: true,
      countTotal: orders.length,
      total: totalOrder,
      currentPage: parseInt(page),
      message: "All Orders",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

export const singleUserOrder = async (req, res) => {
  try {
    const order = await orderModel.findOne({ _id: req.params.id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Single user order found",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message,
    });
  }
};

export const getAllUserOrder = async (req, res) => {
  try {
    const userId = req.params.userId.trim();
    const { orderStatus, limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "The userId is required",
      });
    }
    let filter = { orderby: userId };

    if (orderStatus) {
      filter.orderStatus = orderStatus.trim();
    }

    const orders = await orderModel
      .find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate({
        path: "products.product",
        select: "name price",
      });

    const totalOrderUser = await orderModel.countDocuments(filter);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      countTotal: totalOrderUser,
      total: orders.length,
      currentPage: parseInt(page),
      message: "User orders found",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user orders",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    await orderModel.findByIdAndRemove(orderId);

    res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Đơn hàng không tồn tại",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đơn hàng",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus, sendDate, receivedDate } = req.body;
    const formattedSendDate = sendDate ? new Date(sendDate) : undefined;
    const formattedReceivedDate = receivedDate
      ? new Date(receivedDate)
      : undefined;

    if (isNaN(formattedSendDate) || isNaN(formattedReceivedDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    const order = await orderModel
      .findByIdAndUpdate(
        orderId,
        {
          orderStatus,
          sendDate: formattedSendDate,
          receivedDate: formattedReceivedDate,
        },
        { new: true }
      )
      .populate("orderby");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Add a notification to the user
    const notificationMessage = `Order #${order._id} status updated to ${orderStatus}`;
    await userModel.findByIdAndUpdate(order.orderby._id, {
      $push: { notifications: notificationMessage },
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { cancelReason } = req.body;

    // Validate cancelReason
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        orderStatus: "Đã hủy đơn",
        cancelReason,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đơn hàng",
      error: error.message,
    });
  }
};

export const getDeliveredProductsForUser = async (req, res) => {
  try {
    const userId = req.params.userId.trim();
    const deliveredOrders = await orderModel
      .find({
        orderby: userId,
        orderStatus: "Đã giao hàng",
      })
      .select("_id");
    console.log("Delivered Orders:", deliveredOrders);
    const deliveredOrderIds = deliveredOrders.map((order) => order._id);
    console.log("Delivered Order IDs:", deliveredOrderIds);
    const productsInDeliveredOrders = await orderModel
      .find({
        _id: { $in: deliveredOrderIds },
      })
      .populate({
        path: "products.product",
        select: "name price reviews",
      });

    console.log("Products In Delivered Orders:", productsInDeliveredOrders);

    res.status(200).json({
      success: true,
      message: "Products in user's delivered orders retrieved successfully",
      products: productsInDeliveredOrders,
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
