const KirimSurat = require("../kirimsurat/model");
const SuratKeluar = require("../suratkeluar/model");

module.exports = {
  index: async (req, res) => {
    try {
      const suratkeluar = await SuratKeluar.find({ isdeleted: false }).populate(
        "pegawai"
      );
      const sukses = await SuratKeluar.countDocuments({ status: "S",isdeleted: false },);
      const cancel = await SuratKeluar.countDocuments({ status: "C",isdeleted: false },);
      const terisi = await SuratKeluar.countDocuments({ status: "T",isdeleted: false },);
      const draft = await SuratKeluar.countDocuments({ status: "D",isdeleted: false },);
      const kirim = await KirimSurat.aggregate([
        { $match: { statusKirim: "T" } },
        { $group: { _id: "$penerima", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
      console.log("TOTAL SUKSES >> ",sukses)
      res.render("admin/dashboard/view_dashboard", {
        name: req.session.user.name,
        title: " Dashboard",
        top: kirim,
        role: req.session.user.role,
        statistikStatus: {
          sukses,
          cancel,
          terisi,
          draft,
        },
        suratkeluar,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  },
};
