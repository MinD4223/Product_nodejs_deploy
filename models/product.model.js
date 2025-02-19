const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: String,
    default: ""
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  featured: String,
  position: Number,
  createBy:{
    account_id: String,
    createAt: {
        type: Date,
        default: Date.now
    }
  },
  updateBy:[
    {
      account_id: String,
      updateAt: Date,
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    slug: "title",
    unique: true
  }
},{
  timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
