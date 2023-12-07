import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    city: { type: String },
    district: { type: String },
    commune: { type: String },
    detail: { type: String },
  },
  {
    _id: false, // Disable automatic generation of _id for subdocument
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: addressSchema, // Embed the address schema
    password: { type: String, required: true },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    notifications:{
      type: Array,
      default: []
    },
    seenNotification:{
      type: Array,
      default: []
    },
    verifytoken: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export default mongoose.model("User", userSchema);
