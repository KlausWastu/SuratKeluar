const AddUser = require("./model");
const Admin = require("../admin/model");
const bcrypt = require("bcryptjs");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const adduser = await AddUser.find().populate("user");
      res.render("admin/adduser/view_adduser", {
        role: req.session.user.role,
        adduser,
        alert,
        name: req.session.user.name,
        title: " User",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/adduser");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/adduser/create", {
        name: req.session.user.name,
        role: req.session.user.role,
        title: " Tambah User",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/adduser");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { email, password, name, departemen } = req.body;
      const data = await Admin.findOne({ email });
      if (data) {
        req.flash("alertMessage", "Email sudah digunakan");
        req.flash("alertStatus", "success");
        res.redirect("/adduser");
      } else {
        let role = "user";
        let hashpassword = await bcrypt.hash(password, 10);
        let user = await Admin({ email, password: hashpassword, name, role });
        await user.save();
        let add = await AddUser({ departemen, user });
        await add.save();
        req.flash("alertMessage", "Berhasil menambahkan data pengguna");
        req.flash("alertStatus", "success");
        res.redirect("/adduser");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/adduser");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const edituser = await AddUser.findOne({ _id: id });
      const user = await Admin.findOne({ _id: edituser.user });
      res.render("admin/adduser/edit", {
        user,
        edituser,
        name: req.session.user.name,
        role: req.session.user.role,
        title: " Edit User",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/adduser");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { password, name, departemen } = req.body;
      if (password != "") {
        let hashpassword = await bcrypt.hash(password, 10);
        const ubahadduser = await AddUser.findOneAndUpdate(
          {
            _id: id,
          },
          {
            departemen,
          }
        );
        await Admin.findOneAndUpdate(
          {
            _id: ubahadduser.user,
          },
          {
            name,
            password: hashpassword,
          }
        );
        req.flash("alertMessage", "Berhasil Edit data User");
        req.flash("alertStatus", "success");
        res.redirect("/adduser");
      } else {
        // let user = await Admin({ email, password: hashpassword, name, role });
        // await user.save();
        // let add = await AddUser({ departemen, user });
        // await add.save();
        const ubahadduser = await AddUser.findOneAndUpdate(
          {
            _id: id,
          },
          {
            departemen,
          }
        );
        await Admin.findOneAndUpdate(
          {
            _id: ubahadduser.user,
          },
          {
            name,
          }
        );
        req.flash("alertMessage", "Berhasil Edit data User");
        req.flash("alertStatus", "success");
        res.redirect("/adduser");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/adduser");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      let admin = await AddUser.findOne({ _id: id });
      let pengguna = await Admin.findOne({ _id: admin.user });

      if (admin.user.equals(pengguna._id)) {
        await Admin.findOneAndUpdate({ _id: admin.user }, { status });
      }
      req.flash("alertMessage", `Berhasil mengubah status data pengguna `);
      req.flash("alertStatus", "success");
      res.redirect("/adduser");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/adduser");
    }
  },
};
