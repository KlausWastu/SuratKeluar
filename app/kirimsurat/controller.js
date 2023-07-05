const KirimSurat = require("./model");
const Kurir = require("../kurir/model");
const Pegawai = require("../pegawai/model");
const SuratKeluar = require("../suratkeluar/model");
const moment = require("moment");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const kirimsurat = await KirimSurat.find({ isdeleted: false })
        .populate("nodokumen")
        .populate("kurir")
        .populate("namaHandCarry");
      res.render("admin/kirimsurat/view_kirimsurat", {
        kirimsurat,
        role: req.session.user.role,
        alert,
        name: req.session.user.name,
        title: "Kirim Surat",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const nodokumen = await SuratKeluar.find({
        status: "S",
        isdeleted: false,
        statusskkirim: false,
      });
      const kurir = await Kurir.find({ isdeleted: false });
      const pegawai = await Pegawai.find();

      res.render("admin/kirimsurat/create", {
        nodokumen,
        kurir,
        pegawai,
        name: req.session.user.name,
        role: req.session.user.role,
        title: "Tambah Kirim Surat",
      });

      // Mengatur nilai maksimal picker tanggal terima menjadi tenggat waktu
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kirimsurat");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const {
        noDokumen,
        kurir,
        tanggalkirim,
        tanggalterima,
        noresi,
        penerima,
        namehandcarry,
      } = req.body;
      const dokumen = await KirimSurat.findOne({
        nodokumen: noDokumen,
        statusKirim: ["D", "T"],
      });
      const tanggalKirimID = moment(tanggalkirim, "MM/DD/YYYY")
        .locale("id")
        .format("L");
      const tanggalTerimaID = moment(tanggalterima, "MM/DD/YYYY")
        .locale("id")
        .format("L");
      if (dokumen) {
        if (dokumen.isdeleted === true) {
          if (dokumen.statusKirim === "T") {
            req.flash(
              "alertMessage",
              "Data sudah pernah ditambahkan, namun sudah tidak dimunculkan lagi"
            );
            req.flash("alertStatus", "success");
            res.redirect("/kirimsurat");
          } else if (dokumen.statusKirim === "R") {
            await KirimSurat.findOneAndUpdate(
              { nodokumen: noDokumen },
              {
                nodokumen: noDokumen,
                kurir,
                tanggalKirim: tanggalKirimID,
                tanggalTerima: tanggalTerimaID,
                noresi,
                penerima,
                statusKirim: "D",
                isdeleted: false,
              }
            );
            req.flash("alertMessage", "Berhasil tambah kirim surat");
            req.flash("alertStatus", "success");

            res.redirect("/kirimsurat");
          }
        } else if (dokumen.isdeleted === false) {
          if (dokumen.statusKirim === "D") {
            req.flash(
              "alertMessage",
              "Nomor Dokumen yang anda masukan sudah ditambahkan dan sedang dikirim"
            );
            req.flash("alertStatus", "success");
            res.redirect("/kirimsurat");
          } else if (dokumen.statusKirim === "T") {
            req.flash(
              "alertMessage",
              "Nomor Dokumen yang anda masukan sudah ditambahkan dan sudah terkirim"
            );
            req.flash("alertStatus", "success");
            res.redirect("/kirimsurat");
          } else if (dokumen.statusKirim === "R") {
            const newKirim = new KirimSurat({
              nodokumen: noDokumen,
              kurir,
              tanggalKirim: tanggalKirimID,
              tanggalTerima: tanggalTerimaID,
              noresi,
              penerima,
            });
            await SuratKeluar.findOneAndUpdate(
              { _id: noDokumen },
              { statusskkirim: true }
            );
            await newKirim.save();
            req.flash("alertMessage", "Berhasil tambah kirim surat");
            req.flash("alertStatus", "success");

            res.redirect("/kirimsurat");
          }
        }
      } else {
        if (kurir === "64378bb0227ecdcdacef9705") {
          const newKirim = new KirimSurat({
            nodokumen: noDokumen,
            kurir,
            namaHandCarry: namehandcarry,
            tanggalKirim: tanggalKirimID,
            tanggalTerima: tanggalTerimaID,
            noresi,
            penerima,
          });
          await SuratKeluar.findOneAndUpdate(
            { _id: noDokumen },
            { statusskkirim: true }
          );
          await newKirim.save();
          req.flash("alertMessage", "Berhasil tambah kirim surat");
          req.flash("alertStatus", "success");

          res.redirect("/kirimsurat");
        } else {
          const newKirim = new KirimSurat({
            nodokumen: noDokumen,
            kurir,
            tanggalKirim: tanggalKirimID,
            tanggalTerima: tanggalTerimaID,
            noresi,
            penerima,
          });
          await SuratKeluar.findOneAndUpdate(
            { _id: noDokumen },
            { statusskkirim: true }
          );
          await newKirim.save();
          req.flash("alertMessage", "Berhasil tambah kirim surat");
          req.flash("alertStatus", "success");

          res.redirect("/kirimsurat");
        }
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kirimsurat");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const nodokumen = await SuratKeluar.find({ status: "S" });
      const kurir = await Kurir.find({ isdeleted: false });
      const kirimsurat = await KirimSurat.findOne({ _id: id })
        .populate("nodokumen")
        .populate("kurir");

      res.render("admin/kirimsurat/edit", {
        nodokumen,
        kurir,
        kirimsurat,
        role: req.session.user.role,
        name: req.session.user.name,
        title: " Edit Kirim Surat",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kirimsurat");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { statusKirim } = req.query;

      const ks = await KirimSurat.findById({ _id: id });
      await KirimSurat.findOneAndUpdate({ _id: id }, { statusKirim });
      if (statusKirim === "R") {
        await SuratKeluar.findOneAndUpdate(
          { _id: ks.nodokumen },
          { statusskkirim: false }
        );
      }
      req.flash("alertMessage", "Berhasil mengubah status Kirim Surat");
      req.flash("alertStatus", "success");
      res.redirect("/kirimsurat");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kirimsurat");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        noDokumen,
        kurir,
        tanggalkirim,
        tanggalterima,
        noresi,
        penerima,
      } = req.body;
      const tanggalKirimID = moment(tanggalkirim, "MM/DD/YYYY")
        .locale("id")
        .format("L");
      const tanggalTerimaID = moment(tanggalterima, "MM/DD/YYYY")
        .locale("id")
        .format("L");
      await KirimSurat.findOneAndUpdate(
        {
          _id: id,
        },
        {
          nodokumen: noDokumen,
          kurir,
          tanggalKirim: tanggalKirimID,
          tanggalTerima: tanggalTerimaID,
          noresi,
          penerima,
        }
      );
      req.flash("alertMessage", "Berhasil edit kirim surat");
      req.flash("alertStatus", "success");
      res.redirect("/kirimsurat");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kirimsurat");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      await KirimSurat.findOneAndUpdate({ _id: id }, { isdeleted: true });

      req.flash("alertMessage", "Berhasil menghapus data Kirim Surat");
      req.flash("alertStatus", "success");
      res.redirect("/kirimsurat");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/kirimsurat");
    }
  },
};
