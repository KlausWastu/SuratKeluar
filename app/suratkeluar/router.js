var express = require("express");
var router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  actionDelete,
  viewEdit,
  actionEdit,
  actionStatus,
  exportdata,
  viewKlasifikasi,
  actionKlasifikasi,
} = require("./controller");
const multer = require("multer");
const os = require("os");
const { isLoginAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", index);
router.get("/klasifikasi", viewKlasifikasi);
router.post("/kodeklasifikasi", actionKlasifikasi);
router.get("/create", viewCreate);
router.post(
  "/create",
  multer({ dest: os.tmpdir() }).single("uploaddokumen"),
  actionCreate
);
router.get("/edit/:id", viewEdit);
router.put(
  "/edit/:id",
  multer({ dest: os.tmpdir() }).single("uploaddokumen"),
  actionEdit
);
router.delete("/delete/:id", actionDelete);
router.put("/status/:id", actionStatus);
router.get("/exportData", exportdata);
module.exports = router;
