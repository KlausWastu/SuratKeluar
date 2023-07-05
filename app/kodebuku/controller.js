const KodeBuku = require("./model");
module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const kodebuku = await KodeBuku.find({ isdeleted: false });
      res.render("admin/kodebuku/view_kodebuku", {
        kodebuku,
        role: req.session.user.role,
        alert,
        name: req.session.user.name,
        title: " Kode Buku",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kodebuku");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/kodebuku/create", {
        name: req.session.user.name,
        title: " Tambah Kode Buku",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kodebuku");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { kodedokumen } = req.body;
      const buku = await KodeBuku.findOne({ kodedokumen });

      if (buku) {
        if (buku.isdeleted === true) {
          await KodeBuku.findOneAndUpdate(
            { kodedokumen },
            { isdeleted: false }
          );
          req.flash(
            "alertMessage",
            "Berhasil menambahkan data Kode Klasifikasi"
          );
          req.flash("alertStatus", "success");
          res.redirect("/kodebuku");
        } else if (buku.isdeleted === false) {
          req.flash(
            "alertMessage",
            "Kode Klasifikasi yang anda masukan sudah ditambahkan"
          );
          req.flash("alertStatus", "success");
          res.redirect("/kodebuku");
        }
      } else {
        const kodebuku = await KodeBuku({ kodedokumen });
        await kodebuku.save();
        req.flash("alertMessage", "Berhasil menambahkan data Kode Klasifikasi");
        req.flash("alertStatus", "success");
        res.redirect("/kodebuku");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kodebuku");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const kodebuku = await KodeBuku.findOne({ _id: id });
      res.render("admin/kodebuku/edit", {
        kodebuku,
        name: req.session.user.name,
        title: " Edit Kode Buku",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kodebuku");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { kodedokumen } = req.body;
      await KodeBuku.findOneAndUpdate(
        {
          _id: id,
        },
        { kodedokumen }
      );
      req.flash("alertMessage", "Berhasil Edit data Kode Buku");
      req.flash("alertStatus", "success");
      res.redirect("/kodebuku");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kodebuku");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await KodeBuku.findOneAndUpdate({ _id: id }, { isdeleted: true });
      req.flash("alertMessage", "Berhasil menghapus data Kode Buku");
      req.flash("alertStatus", "success");
      res.redirect("/kodebuku");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kodebuku");
    }
  },
};
