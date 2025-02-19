const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/createTree")
module.exports.index = async(req, res) => {
  const productCategory  =await ProductCategory.find({
    deleted: false
  })
  const newProductCategory = createTreeHelper.tree(productCategory)
  res.render("client/page/home/index", { 
    titlePage: "Trang chủ" ,
    records: newProductCategory
  });
};
