const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")
const productsHelper = require("../../helpers/products")
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
      slug: req.params.slugProduct,
      status: "active"
    }

    const product = await Product.findOne(find);

    res.render("client/page/product/detail", {
      titlePage: "Chi tiết sản phẩm",
      product: product
    })
  } catch (error) {
    res.redirect("/products")
  }
  
};

module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false
  })

  const getSubCategory = async(parentId) =>{
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    })
    let allSub = [...subs];

    for(sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  }

  const listCategory = await getSubCategory(category.id);

  const listCategoryId = listCategory.map(item => item.id)

  const products = await Product.find({
    product_category_id: {$in: [category.id,...listCategoryId]},
    deleted: false
  }).sort({position: "desc"});
  
  const newProduct = productsHelper.priceNewProduct(products)
  res.render("client/page/product/index", {
    titlePage: "Danh sách sản phẩm",
    products: newProduct,
  });
};
