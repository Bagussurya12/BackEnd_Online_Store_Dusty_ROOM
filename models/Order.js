import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    phoneNumberCustomer: {
      type: String,
    },
    emailCustomer: {
      type: String,
    },
    shirtColor: {
      type: String,
    },
    shirtMaterial: {
      type: String,
      enum: ["Combed 24 S", "Combed 30 s"],
      default: "Combed 30 s",
    },
    amountOrder: {
      type: Number,
    },
    printingType: {
      type: String,
      enum: ["plastisol", "rubber", "DTF"],
      default: "plastisol",
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Not Paid", "Down Payment"],
      default: "Not Paid",
    },
    orderProcess: {
      type: String,
    },
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    },
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

// Schema.virtual("products", {
//   ref: "product",
//   localField: "productId",
//   foreignField: "_id",
// });

Schema.plugin(mongoosePaginate);

export default mongoose.model("Order", Schema);
