const Product = require("../../models/product.model");
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  products.forEach((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(1);
  });

  res.render("client/page/product/index", {
    titlePage: "Danh sách sản phẩm",
    products: products,
  });
};

module.exports.detail = async (req, res) => {
  try {
    const find ={
      deleted: false,
      slug: req.params.slug,
      status: "active"
    }

    const product = await Product.findOne(find);
    console.log(product)

    res.render("client/page/product/detail", {
      titlePage: "Chi tiết sản phẩm",
      product: product
    })
  } catch (error) {
    res.redirect("/products")
  }
  
};
