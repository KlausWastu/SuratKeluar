const Admin = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/signin/view_signin", {
          alert,
          title: "Signin",
        });
      } else {
        if (req.session.user.role === "admin") {
          res.redirect("/adduser");
        } else {
          res.redirect("/dashboard");
        }
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await Admin.findOne({ email: email });
      if (check) {
        if (check.status === "Y") {
          const checkpassword = await bcrypt.compare(password, check.password);
          if (checkpassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              role: check.role,
              name: check.name,
            };
            if (check.role === "admin") {
              res.redirect("/adduser");
            } else {
              res.redirect("/dashboard");
            }
          } else {
            req.flash("alertMessage", `Kata Sandi yang anda masukan salah`);
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          req.flash(
            "alertMessage",
            `Akun anda di NonAktifkan, silahkan hubungi admin `
          );
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", `Email yang anda masukan salah`);
        req.flash("alertStatus", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionLogout: async (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
  viewChangePassword: async (req, res) => {
    try {
      const admin = await Admin.findById(req.session.user.id);
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/ubahPassword/view_changepass", {
        admin,
        alert,
        user: req.session.user,
        title: "Ubah Password",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
  actionUbahPassword: async (req, res) => {
    try {
      const { currentpassword, newpassword } = req.body;
      const admin = await Admin.findById(req.session.user.id);
      // const hashpass = bcrypt.hash(newpassword, 10);
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(newpassword, salt);
      const checkpass = await bcrypt.compare(currentpassword, admin.password);
      if (checkpass) {
        await Admin.findOneAndUpdate(
          { _id: req.session.user.id },
          {
            password: hashpass,
          }
        );

        req.flash("alertMessage", `Berhasil update password`);
        req.flash("alertStatus", "success");
        req.session.destroy();
        res.redirect("/");
      } else {
        req.flash("alertMessage", "Gagal update password");
        req.flash("alertStatus", "danger");
        res.redirect("/ubahpassword");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
};
