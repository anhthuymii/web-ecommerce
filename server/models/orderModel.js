import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: { type: String, required: true },
        slug: {
          type: String,
          required: true,
        },
        size: { type: String, required: true },
        quantity: { type: String, required: true },
        price: { type: Number, required: true },
        photo: { data: Buffer, contentType: String },
        reviews: [
          {
            id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Review",
            },
            comment: {
              type: String,
              required: true,
            },
            star: {
              type: Number,
              required: true,
            },
            reviewPhoto: [
              {
                data: Buffer,
                contentType: String,
              },
            ],
          },
        ],
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      required: true,
    },
    cancelReason: { type: String },
    // userCancel: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sendDate: { type: Date },
    receivedDate: { type: Date },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notifications: {
      type: Array,
      default: [],
    },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    address: {
      city: {
        type: String,
      },
      district: {
        type: String,
      },
      commune: {
        type: String,
      },
      detail: {
        type: String,
        // required: true,
      },
    },

    // paymentId: { type: String },
    totalPrice: { type: Number, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    strictPopulate: false, 
  }
);

export default mongoose.model("Order", orderSchema);
