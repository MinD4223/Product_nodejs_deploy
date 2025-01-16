const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../../controller/admin/product-category.controller")
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validate/admin/product-category.validate");

router.get("/", controller.index);

router.get("/create", controller.create)

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

module.exports = router;