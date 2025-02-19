const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/my-account.controller")

router.get("/", controller.index);

module.exports = router;