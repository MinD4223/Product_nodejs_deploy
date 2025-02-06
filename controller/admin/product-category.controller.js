const ProductCategory = require("../../models/product-category.model");
const { prefixAdmin } = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree")
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  function createTree(arr, parentId = "") {
    const tree = [];
    arr.forEach((item) => {
      if (item.parent_id === parentId) {
        const newItem = item;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
          newItem.children = children;
        }
        tree.push(newItem);
      }
    });
    return tree;
  }

  const record = await ProductCategory.find(find);

  const newRecords = createTree(record)
  res.render("admin/page/product-category/index", {
    titlePage: "Danh mục sản phẩm",
    record: newRecords,
  });
};

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  // function createTree(arr, parentId = "") {
  //   const tree = [];
  //   arr.forEach((item) => {
  //     if (item.parent_id === parentId) {
  //       const newItem = item;
  //       const children = createTree(arr, item.id);
  //       if (children.length > 0) {
  //         newItem.children = children;
  //       }
  //       tree.push(newItem);
  //     }
  //   });
  //   return tree;
  // }

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/page/product-category/create", {
    titlePage: "Tạo danh mục sản phẩm",
    records: newRecords,
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
  await record.save();

  res.redirect(`${prefixAdmin}/product-category`);
};
