const Departemen = require("./model");
module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const departemen = await Departemen.find({ isdeleted: false });
      res.render("admin/departemen/view_departemen", {
        departemen,
        alert,
        name: req.session.user.name,
        role: req.session.user.role,
        title: " Departemen",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/departemen/create", {
        name: req.session.user.name,
        title: " Tambah Departemen",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { nameDepartemen } = req.body;
      const name = await Departemen.findOne({ nameDepartemen });

      if (name) {
        if (name.isdeleted === true) {
          await Departemen.findOneAndUpdate(
            { nameDepartemen },
            { isdeleted: false }
          );
          req.flash("alertMessage", "Berhasil menambahkan data Departemen");
          req.flash("alertStatus", "success");
          res.redirect("/departemen");
        } else if (name.isdeleted === false) {
          req.flash(
            "alertMessage",
            "Departemen yang anda masukan sudah ditambahkan"
          );
          req.flash("alertStatus", "success");
          res.redirect("/departemen");
        }
      } else {
        let departemen = await Departemen({ nameDepartemen });
        await departemen.save();
        req.flash("alertMessage", "Berhasil menambahkan data Departemen");
        req.flash("alertStatus", "success");
        res.redirect("/departemen");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const departemen = await Departemen.findOne({ _id: id });
      res.render("admin/departemen/edit", {
        departemen,
        name: req.session.user.name,
        role: req.session.user.role,
        title: " Edit Departemen",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let departemen = await Departemen.findOne({ _id: id });
      let status = departemen.status === "Y" ? "N" : "Y";
      departemen = await Departemen.findOneAndUpdate({ _id: id }, { status });

      req.flash("alertMessage", "Berhasil mengubah status Departemen");
      req.flash("alertStatus", "success");
      res.redirect("/departemen");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { nameDepartemen } = req.body;
      await Departemen.findOneAndUpdate(
        {
          _id: id,
        },
        { nameDepartemen }
      );
      req.flash("alertMessage", "Berhasil Edit data Departemen");
      req.flash("alertStatus", "success");
      res.redirect("/departemen");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Departemen.findOneAndUpdate({ _id: id }, { isdeleted: true });
      req.flash("alertMessage", "Berhasil menghapus data Departemen");
      req.flash("alertStatus", "success");
      res.redirect("/departemen");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/departemen");
    }
  },
};
