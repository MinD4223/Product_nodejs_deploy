const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatusHelper");
const searchHelper = require("../../helpers/searchHelper");
const paginationHelper = require("../../helpers/paginationHelper");
const { prefixAdmin } = require("../../config/system");
module.exports.product = async (req, res) => {
  let find = {
    deleted: false,
  };
  let filterStatus = filterStatusHelper(req.query);
  let search = searchHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }
  if (search.regex) {
    find.title = search.regex;
  }
  const countProducts = await Product.countDocuments(find);
  //Pagitination
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 3,
    },
    req.query,
    countProducts
  );
  //End Pagitination

  let sort = {};
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue;
  }else{
    sort.position = "desc"
  }
  

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.render("admin/page/product/index", {
    titlePage: "San pham",
    products: products,
    filterStatus: filterStatus,
    keyword: search.keyword,
    pagination: objectPagination,
  });
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect("back");
};

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái của ${ids.length} thành công`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái của ${ids.length} thành công`);
      break;
    case "deleted-all":
      await Product.updateMany({ _id: { $in: ids } }, { deleted: "true" });
      req.flash("success", `Cập nhật trạng thái của ${ids.length} thành công`);
      break;
    case "change-position":
      for (item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne({ _id: id }, { position: position });
      }
      break;
    default:
      break;
  }

  res.redirect("back");
};

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  // await Product.deleteOne({_id: id});
  await Product.updateOne({ _id: id }, { deleted: true });

  res.redirect("back");
};

module.exports.create = (req, res) => {
  res.render("admin/page/product/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

module.exports.createPost = async (req, res) => {
  
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${prefixAdmin}/products`);
};

module.exports.edit = async(req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const product = await Product.findOne(find)
    console.log(product)
  
    res.render("admin/page/product/edit", {
      titlePage: "Chỉnh sửa sản phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/products`);
  }
};

module.exports.editPatch = async(req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: req.params.id}, req.body);
    req.flash("success", "Cập nhật thành công")
  } catch (error) {
    req.flash("success", "Cập nhật thất bại")
  }

  res.redirect(`back`);
};

module.exports.detail = async(req, res) =>{
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
  
    const product = await Product.findOne(find);
    res.render("admin/page/product/detail", {
      titlePage: "Chi tiết sản phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/products`);
  }
  
}