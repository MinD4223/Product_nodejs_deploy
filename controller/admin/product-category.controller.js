const ProductCategory = require("../../models/product-category.model");
const { prefixAdmin } = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree")
module.exports.index = async (req, res) => {
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

  const record = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(record)
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

module.exports.edit = async (req, res) => {
  try {
    const findDetail = {
      _id: req.params.id,
      deleted: false
    }
  
    const find = {
      deleted: false
    }
  
    const data = await ProductCategory.findOne(findDetail);
  
    const records = await ProductCategory.find(find);
  
    const newRecords = createTreeHelper.tree(records);
  
    res.render("admin/page/product-category/edit", {
      titlePage: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/product-category`)
  }
  
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);

  console.log(id)
  console.log(req.body)
  await ProductCategory.updateOne({_id: id}, req.body)

  res.redirect("back")
};