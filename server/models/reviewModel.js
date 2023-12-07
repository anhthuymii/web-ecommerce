import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      // email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    orders: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          required: true,
        },
        products: [
          {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            name: { type: String, required: true },
            slug: {
              type: String,
              required: true,
            },
            size: { type: String, required: true },
            quantity: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
      },
    ],
    reviewPhoto: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review; // Export as default
