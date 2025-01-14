const express = require("express");
const multer = require("multer");
const router = express.Router();
// const storageMulter = require("../../helpers/storageMulterHelper");
const upload = multer();
const controller = require("../../controller/admin/product.controller");
const validate = require("../../validate/admin/product.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.product);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;
