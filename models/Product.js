import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
Schema.virtual("categories", {
  ref: "category",
  localField: "categoryId",
  foreignField: "_id",
});
Schema.plugin(mongoosePaginate);

export default mongoose.model("Product", Schema);
