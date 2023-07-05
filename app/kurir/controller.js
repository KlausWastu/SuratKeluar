const Kurir = require("./model");
module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const kurir = await Kurir.find({ isdeleted: false });
      res.render("admin/kurir/view_kurir", {
        kurir,
        alert,
        name: req.session.user.name,
        role: req.session.user.role,
        title: " Kurir",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kurir");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/kurir/create", {
        name: req.session.user.name,
        title: " Tambah Kurir",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kurir");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { kurirName, urltracking } = req.body;
      const name = await Kurir.findOne({ kurirName });
      if (name) {
        if (name.isdeleted === true) {
          await Kurir.findOneAndUpdate(
            { kurirName },
            { isdeleted: false, urlTracking: urltracking }
          );
          req.flash("alertMessage", "Berhasil menambahkan data kurir");
          req.flash("alertStatus", "success");
          res.redirect("/kurir");
        } else if (name.isdeleted === false) {
          req.flash(
            "alertMessage",
            "Kurir yang anda inputkan sudah ditambahkan"
          );
          req.flash("alertStatus", "success");
          res.redirect("/kurir");
        }
      } else {
        const name = new Kurir({ kurirName, urlTracking: urltracking });
        await name.save();
        req.flash("alertMessage", "Berhasil menambahkan data kurir");
        req.flash("alertStatus", "success");
        res.redirect("/kurir");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kurir");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const kurir = await Kurir.findOne({ _id: id });
      res.render("admin/kurir/edit", {
        kurir,
        name: req.session.user.name,
        title: " Edit Kurir",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kurir");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { kurirName, urltracking } = req.body;
      await Kurir.findOneAndUpdate(
        {
          _id: id,
        },
        { kurirName, urlTracking: urltracking }
      );
      req.flash("alertMessage", "Berhasil Edit data Kurir");
      req.flash("alertStatus", "success");
      res.redirect("/kurir");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kurir");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Kurir.findOneAndUpdate({ _id: id }, { isdeleted: true });
      req.flash("alertMessage", "Berhasil menghapus data Kurir");
      req.flash("alertStatus", "success");
      res.redirect("/kurir");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kurir");
    }
  },
};
