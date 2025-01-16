const ProductCategory = require("../../models/product-category.model")
const { prefixAdmin } = require("../../config/system");
module.exports.index = async(req, res) => {
  let find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find)
  res.render("admin/page/product-category/index", {
    titlePage: "Danh mục sản phẩm",
    record: record
  });
};

module.exports.create = (req, res) => {
  res.render("admin/page/product-category/create", {
    titlePage: "Tạo danh mục sản phẩm",
  });
};

module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save()

  res.redirect(`${prefixAdmin}/product-category`);
};
