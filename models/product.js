const mongoose = require("mongoose");

// Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name."],
    maxLength: [25, "A product name can not exceed more than 25 characters."],
    minLength: [3, "A product name must contain atleast 3 characters."],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price."],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
});

// Model
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;

//! Imporant Points In This File
// "{VALUE} is not supported" -> In this, {VALUE} is special syntax mongoose allows us, it will be replaced with the actual value that user has provided automatically by mongoose.

// By default schema validation are executed only at the creation of the document. If you are updating the document the validation will not be get executed by default. You will have to mention explictly to run validation.
// e.g. -> Product.findByIdAndUpdate(id, req.body, {runValidators: true,})
