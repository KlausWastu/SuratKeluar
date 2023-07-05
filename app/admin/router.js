var express = require("express");
var router = express.Router();
const {
  viewSignin,
  actionSignin,
  actionLogout,
  viewChangePassword,
  actionUbahPassword,
} = require("./controller");

/* GET home page. */
router.get("/", viewSignin);
router.post("/", actionSignin);
router.get("/logout", actionLogout);
router.get("/ubahpassword", viewChangePassword);
router.put("/ubah/:id", actionUbahPassword);

module.exports = router;
