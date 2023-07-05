var express = require("express");
var router = express.Router();
const {
  index,
  viewCreate,
  actionCreate,
  actionStatus,
  viewEdit,
  actionEdit,
} = require("./controller");
const { isLoginAdmin, isAdmin } = require("../middleware/auth");

router.use(isLoginAdmin);
router.get("/", isAdmin, index);
router.get("/create", isAdmin, viewCreate);
router.post("/create", isAdmin, actionCreate);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);
router.put("/status/:id", actionStatus);

module.exports = router;
