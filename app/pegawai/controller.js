const Pegawai = require("./model");
module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const pegawai = await Pegawai.find({ isdeleted: false });
      res.render("admin/pegawai/view_pegawai", {
        role: req.session.user.role,
        alert,
        name: req.session.user.name,
        title: "Pegawai SPJT",
        pegawai,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/pegawai");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/pegawai/create", {
        name: req.session.user.name,
        title: " Tambah Pegawai",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/pegawai");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { namaPegawai } = req.body;
      const pegawai = await Pegawai.findOne({ namaPegawai });
      if (pegawai) {
        if (pegawai.isdeleted != true) {
          req.flash(
            "alertMessage",
            "Nama Pegawai yang anda masukan, sudah ditambahkan"
          );
          req.flash("alertStatus", "success");
          res.redirect("/pegawai");
        } else {
          await Pegawai.findOneAndUpdate({ namaPegawai }, { isdeleted: false });
          req.flash("alertMessage", "Berhasil tambah data Pegawai ");
          req.flash("alertStatus", "success");
          res.redirect("/pegawai");
        }
      } else {
        const pegawai = await Pegawai({ namaPegawai });
        await pegawai.save();
        req.flash("alertMessage", "Berhasil tambah data Pegawai ");
        req.flash("alertStatus", "success");
        res.redirect("/pegawai");
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
      const pegawai = await Pegawai.findOne({ _id: id });
      res.render("admin/pegawai/edit", {
        pegawai,
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
      res.redirect("/pegawai");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/pegawai");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await Pegawai.findOneAndUpdate({ _id: id }, { isdeleted: true });
      req.flash("alertMessage", "Berhasil menghapus data Kode Buku");
      req.flash("alertStatus", "success");
      res.redirect("/pegawai");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/pegawai");
    }
  },
};
