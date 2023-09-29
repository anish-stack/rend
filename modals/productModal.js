const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    Cancelprice: {
      type: Number,
      required: [true, "Please Enter Cancel  product Price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
  },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        String
    ],
    category: {
        type: String,
    },
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
  
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
        {
            type: String,
        },
    ],
    keywords: [
        {
          type: String,
        },
      ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);
