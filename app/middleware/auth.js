module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis silahkan login kembali`
      );
      req.flash("alertStatus", "danger");
      res.redirect("/");
    } else {
      next();
    }
  },
  isAdmin: (req, res, next) => {
    if (req.session.user.role === "admin") {
      return next();
    } else {
      return res.status(401).send("Tidak bisa akses");
    }
  },
};
