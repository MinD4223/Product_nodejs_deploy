const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")
module.exports.index = async(req, res) => {
  // Sản phẩm nổi bật
  const product  =await Product.find({
    deleted: false,
    featured: "1",
    status: "active"
  });
  const newProduct = productsHelper.priceNewProduct(product)
  // Sản phẩm mới nhất
  const productLatest  =await Product.find({
    deleted: false,
    status: "active"
  }).sort({position: "desc"}).limit(6);


  res.render("client/page/home/index", { 
    titlePage: "Trang chủ" ,
    records: newProduct,
    recordsLatest: productLatest
  });
};
