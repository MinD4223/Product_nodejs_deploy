const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const controller = require("../../controller/admin/setting.controller");

router.get("/general", controller.index);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.update
);

module.exports = router;
