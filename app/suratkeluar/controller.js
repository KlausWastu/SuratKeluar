const SuratKeluar = require("./model");
const kodeBuku = require("../kodebuku/model");
const Departemen = require("../departemen/model");
const Pegawai = require("../pegawai/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

const createCSVWRITER = require("csv-writer").createObjectCsvWriter;

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const suratkeluar = await SuratKeluar.find({ isdeleted: false })
        .populate("kodebuku")
        .populate("departemen")
        .populate("pegawai");
      res.render("admin/suratkeluar/view_suratkeluar", {
        suratkeluar,
        alert,
        role: req.session.user.role,
        name: req.session.user.name,
        title: " Surat Keluar",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  viewKlasifikasi: async (req, res) => {
    try {
      const kodebuku = await kodeBuku.find();
      res.render("admin/suratkeluar/klasifikasi", {
        name: req.session.user.name,
        title: " Tambah Surat Keluar",
        role: req.session.user.role,
        kodebuku,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  actionKlasifikasi: async (req, res) => {
    try {
      const { kodebuku } = req.body;
      res.redirect("/suratkeluar/create?kodebuku=" + kodebuku);
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const kodebuku = await kodeBuku.find();
      const departemen = await Departemen.find({
        status: "Y",
        isdeleted: false,
      });
      const pegawai = await Pegawai.find({ isdeleted: false });
      const currDate = new Date();
      const tahun = String(currDate.getFullYear());
      const tanggal = String(currDate.getDate()).padStart(2, "0");
      const bulan = String(currDate.getMonth() + 1).padStart(2, "0");
      const date = tanggal + "/" + bulan + "/" + tahun;

      // Slicing tahun
      const slcyear = tahun.slice(2);

      // Slicing kode klasifikasi
      const kode = req.query.kodebuku;
      const buku = await kodeBuku.findOne({ _id: kode });
      const kd = String(buku.kodedokumen);
      const slckode = kd.slice(0, 3);

      // INDEX

      async function getNomorDokumenTerbaru() {
        const suratKeluarTerbaru = await SuratKeluar.findOne().sort({
          createdAt: -1,
        });
        const suratKeluarSebelumTerbaru = await SuratKeluar.findOne()
          .sort({
            createdAt: -1,
          })
          .skip(1);
        const suratKeluarCancel = await SuratKeluar.findOne({
          statuscancel: true,
        });
        let index = "01";
        let indexCancel = null;
        let indexTerbaru = null;
        let digitNomorDokumenTerbaru = "0";
        let digitNomorDokumenLama = "0";
        let digitNomorDokumen = "0";
        if (suratKeluarCancel !== null) {
          const nomorDokumenTerbaru = String(suratKeluarCancel.noDokumen);
          const panjangNomorDokumenTerbaru = nomorDokumenTerbaru.length;
          if (panjangNomorDokumenTerbaru === 20) {
            digitNomorDokumenTerbaru = nomorDokumenTerbaru.slice(
              panjangNomorDokumenTerbaru - 6,
              panjangNomorDokumenTerbaru - 4
            );
          } else if (panjangNomorDokumenTerbaru === 21) {
            digitNomorDokumenTerbaru = nomorDokumenTerbaru.slice(
              panjangNomorDokumenTerbaru - 7,
              panjangNomorDokumenTerbaru - 4
            );
          }
          indexCancel = digitNomorDokumenTerbaru;
          index = indexCancel;
        } else if (
          suratKeluarTerbaru !== null &&
          suratKeluarCancel === null &&
          (suratKeluarSebelumTerbaru !== null || !suratKeluarSebelumTerbaru)
        ) {
          const nomorDokumenTerbaru = String(suratKeluarTerbaru.noDokumen);
          const panjangNomorDokumenTerbaru = nomorDokumenTerbaru.length;
          const nomorDokumenLama = String(suratKeluarSebelumTerbaru.noDokumen);
          const panjangNomorDokumenLama = nomorDokumenLama.length;
          if (panjangNomorDokumenLama === 20) {
            digitNomorDokumenLama = nomorDokumenLama.slice(
              panjangNomorDokumenLama - 6,
              panjangNomorDokumenLama - 4
            );
          } else if (panjangNomorDokumenLama === 21) {
            digitNomorDokumenLama = nomorDokumenLama.slice(
              panjangNomorDokumenLama - 7,
              panjangNomorDokumenLama - 4
            );
          }
          if (panjangNomorDokumenTerbaru === 20) {
            digitNomorDokumenTerbaru = nomorDokumenTerbaru.slice(
              panjangNomorDokumenTerbaru - 6,
              panjangNomorDokumenTerbaru - 4
            );
          } else if (panjangNomorDokumenTerbaru === 21) {
            digitNomorDokumenTerbaru = nomorDokumenTerbaru.slice(
              panjangNomorDokumenTerbaru - 7,
              panjangNomorDokumenTerbaru - 4
            );
          }
          if (digitNomorDokumenTerbaru > digitNomorDokumenLama) {
            digitNomorDokumen = digitNomorDokumenTerbaru;
          } else {
            digitNomorDokumen = digitNomorDokumenLama;
          }
          indexTerbaru = (parseInt(digitNomorDokumen, 10) + 1)
            .toString()
            .padStart(2, "0");
          index = indexTerbaru;
        }
        return index;
      }
      const nomorDokumenBaru = await getNomorDokumenTerbaru();

      // Concat Nomor Dokumen = MM.YY/DIREKSI.INDEX/KODE
      const nodok =
        bulan +
        "." +
        slcyear +
        "/" +
        "DIREKSI." +
        nomorDokumenBaru +
        "/" +
        slckode;

      res.render("admin/suratkeluar/create", {
        kodebuku,
        departemen,
        pegawai,
        date,
        nodok,
        kodeklasifikasi: req.query.kodebuku,
        name: req.session.user.name,
        title: " Tambah Surat Keluar",
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const currDate = new Date();
      const tahun = currDate.getFullYear();
      const Tanggal = String(currDate.getDate()).padStart(2, "0");
      const bulan = String(currDate.getMonth() + 1).padStart(2, "0");
      const date = Tanggal + "/" + bulan + "/" + tahun;
      const {
        kodebuku,
        noDokumen,
        perihal,
        tujuan,
        tanggal,
        departemen,
        namaPegawai,
      } = req.body;
      const nomorDok = await SuratKeluar.findOne({
        noDokumen: noDokumen.slice(0, 17),
        status: ["D", "T", "S", "C"],
      });
      const NoDok = await SuratKeluar.findOne({
        statuscancel: true,
      });
      // if (panjangNomorDokumenLama === 20) {
      //   digitNomorDokumenLama = nomorDokumenLama.slice(
      //     panjangNomorDokumenLama - 6,
      //     panjangNomorDokumenLama - 4
      //   );
      // }

      if (nomorDok) {
        if (nomorDok.isdeleted === true) {
          if (nomorDok.status === "S") {
            req.flash(
              "alertMessage",
              "Data sudah ada didatabase, namun tidak terdisplay. Harap Cek Database"
            );
            req.flash("alertStatus", "success");
            res.redirect("/suratkeluar");
          }
        } else if (nomorDok.isdeleted === false) {
          if (nomorDok.status === "S") {
            req.flash(
              "alertMessage",
              "Nomor Dokumen yang anda masukan sudah ditambahkan"
            );
            req.flash("alertStatus", "success");
            res.redirect("/suratkeluar");
          } else if (nomorDok.status === "T") {
            req.flash(
              "alertMessage",
              "Nomor Dokumen yang anda masukan sudah ditambahkan"
            );
            req.flash("alertStatus", "success");
            res.redirect("/suratkeluar");
          } else if (nomorDok.noDokumen === "") {
            if (req.file) {
              let tmp_path = req.file.path;
              let originalExt =
                req.file.originalname.split(".")[
                  req.file.originalname.split(".").length - 1
                ];
              let filename = req.file.filename + "." + originalExt;
              let target_path = path.resolve(
                config.rootPath,
                `public/upload/files/${filename}`
              );

              const src = fs.createReadStream(tmp_path);
              const dest = fs.createWriteStream(target_path);

              src.pipe(dest);

              src.on("end", async () => {
                try {
                  let status = "D";
                  if (noDokumen != "") {
                    status = "T";
                  }
                  const suratkeluar = new SuratKeluar({
                    tanggal,
                    kodebuku,
                    noDokumen,
                    perihal,
                    tujuan,
                    departemen,
                    status,
                    pegawai: namaPegawai,
                    uploadPdf: filename,
                  });
                  await suratkeluar.save();
                  req.flash("alertMessage", "Berhasil tambah surat keluar");
                  req.flash("alertStatus", "success");

                  res.redirect("/suratkeluar");
                } catch (err) {
                  req.flash("alertMessage", `${err.message}`);
                  req.flash("alertStatus", "danger");
                  res.redirect("/suratkeluar");
                }
              });
            } else {
              const suratkeluar = new SuratKeluar({
                tanggal,
                kodebuku,
                noDokumen,
                tujuan,
                perihal,
                departemen,
                pegawai: namaPegawai,
              });
              await suratkeluar.save();
              req.flash("alertMessage", "Berhasil tambah surat keluar");
              req.flash("alertStatus", "success");

              res.redirect("/suratkeluar");
            }
          } else if (nomorDok.status === "D") {
            req.flash(
              "alertMessage",
              "Nomor Dokumen yang anda masukan sudah ditambahkan"
            );
            req.flash("alertStatus", "success");
            res.redirect("/suratkeluar");
          } else if (nomorDok.status === "C") {
            if (req.file) {
              let tmp_path = req.file.path;
              let originalExt =
                req.file.originalname.split(".")[
                  req.file.originalname.split(".").length - 1
                ];
              let filename = req.file.filename + "." + originalExt;
              let target_path = path.resolve(
                config.rootPath,
                `public/upload/files/${filename}`
              );

              const src = fs.createReadStream(tmp_path);
              const dest = fs.createWriteStream(target_path);

              src.pipe(dest);

              src.on("end", async () => {
                try {
                  let status = "D";
                  if (noDokumen != "") {
                    status = "T";
                  }
                  await SuratKeluar.findOneAndUpdate(
                    { noDokumen: nomorDok.noDokumen },
                    { statuscancel: false }
                  );
                  const suratkeluar = new SuratKeluar({
                    tanggal: date,
                    kodebuku,
                    noDokumen,
                    perihal,
                    tujuan,
                    departemen,
                    pegawai: namaPegawai,
                    uploadPdf: filename,
                  });
                  await suratkeluar.save();
                  req.flash("alertMessage", "Berhasil tambah surat keluar");
                  req.flash("alertStatus", "success");

                  res.redirect("/suratkeluar");
                } catch (err) {
                  req.flash("alertMessage", `${err.message}`);
                  req.flash("alertStatus", "danger");
                  res.redirect("/suratkeluar");
                }
              });
            } else {
              await SuratKeluar.findOneAndUpdate(
                { noDokumen: nomorDok.noDokumen },
                { statuscancel: false }
              );
              const suratkeluar = new SuratKeluar({
                tanggal: date,
                kodebuku,
                noDokumen,
                tujuan,
                perihal,
                departemen,
                pegawai: namaPegawai,
              });
              await suratkeluar.save();
              req.flash("alertMessage", "Berhasil tambah surat keluar");
              req.flash("alertStatus", "success");

              res.redirect("/suratkeluar");
            }
          }
        }
      } else if (nomorDok === null) {
        // PERLU DIPERBAIKI LAGI
        if (NoDok !== null) {
          if (req.file) {
            let tmp_path = req.file.path;
            let originalExt =
              req.file.originalname.split(".")[
                req.file.originalname.split(".").length - 1
              ];
            let filename = req.file.filename + "." + originalExt;
            let target_path = path.resolve(
              config.rootPath,
              `public/upload/files/${filename}`
            );

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);

            src.pipe(dest);

            src.on("end", async () => {
              try {
                let status = "D";
                if (noDokumen != "") {
                  status = "T";
                }
                await SuratKeluar.findOneAndUpdate(
                  { statuscancel: true },
                  {
                    statuscancel: false,
                  }
                );
                const suratkeluar = new SuratKeluar({
                  tanggal: date,
                  kodebuku,
                  noDokumen,
                  perihal,
                  tujuan,
                  departemen,
                  status,
                  uploadPdf: filename,
                  pegawai: namaPegawai,
                });
                await suratkeluar.save();
                req.flash("alertMessage", "Berhasil tambah surat keluar");
                req.flash("alertStatus", "success");

                res.redirect("/suratkeluar");
              } catch (err) {
                req.flash("alertMessage", `${err.message}`);
                req.flash("alertStatus", "danger");
                res.redirect("/suratkeluar");
              }
            });
          } else {
            await SuratKeluar.findOneAndUpdate(
              { statuscancel: true },
              {
                statuscancel: false,
              }
            );
            const suratkeluar = new SuratKeluar({
              tanggal: date,
              kodebuku,
              noDokumen,
              tujuan,
              perihal,
              departemen,
              status: "D",
              pegawai: namaPegawai,
            });
            await suratkeluar.save();
            req.flash("alertMessage", "Berhasil tambah surat keluar");
            req.flash("alertStatus", "success");

            res.redirect("/suratkeluar");
          }
        } else {
          if (req.file) {
            let tmp_path = req.file.path;
            let originalExt =
              req.file.originalname.split(".")[
                req.file.originalname.split(".").length - 1
              ];
            let filename = req.file.filename + "." + originalExt;
            let target_path = path.resolve(
              config.rootPath,
              `public/upload/files/${filename}`
            );

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);

            src.pipe(dest);

            src.on("end", async () => {
              try {
                let status = "D";
                if (noDokumen != "") {
                  status = "T";
                }
                const suratkeluar = new SuratKeluar({
                  tanggal: date,
                  kodebuku,
                  noDokumen,
                  perihal,
                  tujuan,
                  departemen,
                  status,
                  uploadPdf: filename,
                  pegawai: namaPegawai,
                });
                await suratkeluar.save();
                req.flash("alertMessage", "Berhasil tambah surat keluar");
                req.flash("alertStatus", "success");

                res.redirect("/suratkeluar");
              } catch (err) {
                req.flash("alertMessage", `${err.message}`);
                req.flash("alertStatus", "danger");
                res.redirect("/suratkeluar");
              }
            });
          } else {
            const suratkeluar = new SuratKeluar({
              tanggal: date,
              kodebuku,
              noDokumen,
              tujuan,
              perihal,
              departemen,
              status: "D",
              pegawai: namaPegawai,
            });
            await suratkeluar.save();
            req.flash("alertMessage", "Berhasil tambah surat keluar");
            req.flash("alertStatus", "success");

            res.redirect("/suratkeluar");
          }
        }
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const kodebuku = await kodeBuku.find();
      const departemen = await Departemen.find({ status: "Y" });
      const pegawai = await Pegawai.find();
      const suratkeluar = await SuratKeluar.findOne({ _id: id })
        .populate("kodebuku")
        .populate("departemen")
        .populate("pegawai");

      res.render("admin/suratkeluar/edit", {
        suratkeluar,
        kodebuku,
        departemen,
        pegawai,
        role: req.session.user.role,
        name: req.session.user.name,
        title: " Edit Surat Keluar",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      if (status === "S") {
        await SuratKeluar.findOneAndUpdate(
          { _id: id },
          { status, statuscancel: false }
        );
      } else if (status === "C") {
        await SuratKeluar.findOneAndUpdate(
          { _id: id },
          { status, statuscancel: true }
        );
      }

      req.flash("alertMessage", "Berhasil mengubah status Surat Keluar");
      req.flash("alertStatus", "success");
      res.redirect("/suratkeluar");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        tanggal,
        kodebuku,
        noDokumen,
        tujuan,
        perihal,
        departemen,
        namaPegawai,
      } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/upload/files/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const suratkeluar = await SuratKeluar.findOne({
              _id: id,
            });
            let files = `${config.rootPath}/public/upload/files/${suratkeluar.uploadPdf}`;
            if (fs.existsSync(files)) {
              fs.unlinkSync(files);
            }
            if (noDokumen != "") {
              await SuratKeluar.findOneAndUpdate(
                { _id: id },
                {
                  tanggal,
                  kodebuku,
                  noDokumen,
                  tujuan,
                  perihal,
                  departemen,
                  uploadPdf: filename,
                  namaPegawai,
                  status: "T",
                }
              );
            }

            req.flash("alertMessage", "Berhasil edit surat keluar");
            req.flash("alertStatus", "success");

            res.redirect("/suratkeluar");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/suratkeluar");
          }
        });
      } else {
        await SuratKeluar.findOneAndUpdate(
          {
            _id: id,
          },
          {
            tanggal,
            kodebuku,
            noDokumen,
            perihal,
            tujuan,
            departemen,
            namaPegawai,
          }
        );
        req.flash("alertMessage", "Berhasil Edit surat keluar");
        req.flash("alertStatus", "success");

        res.redirect("/suratkeluar");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const sk = await SuratKeluar.findOneAndUpdate(
        { _id: id },
        { isdeleted: true }
      );

      let files = `${config.rootPath}/public/upload/files/${sk.uploadPdf}`;
      if (fs.existsSync(files)) {
        fs.unlinkSync(files);
      }

      req.flash("alertMessage", "Berhasil menghapus data Surat Keluar");
      req.flash("alertStatus", "success");
      res.redirect("/suratkeluar");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
  exportdata: async (req, res) => {
    try {
      const suratkeluar = await SuratKeluar.find({ isdeleted: false })
        .populate("departemen")
        .populate("kodebuku")
        .populate("pegawai");

      const csvWritwer = createCSVWRITER({
        path: "public/CSV/suratkeluar.csv",
        header: [
          { id: "no", title: "No" },
          { id: "tanggal", title: "Tanggal" },
          { id: "kode_klasifikasi", title: "Kode Klasifikasi" },
          { id: "nomor_dokumen", title: "Nomor Dokumen" },
          { id: "perihal", title: "Perihal" },
          { id: "tujuan", title: "Tujuan" },
          { id: "penyusun", title: "Penyusun" },
          { id: "pic", title: "PIC" },
          { id: "status_surat", title: "Status Surat" },
        ],
      });

      const data = suratkeluar.map((surat, index) => {
        return {
          no: index + 1,
          tanggal: surat.tanggal,
          kode_klasifikasi: surat.kodebuku.kodedokumen,
          nomor_dokumen: surat.noDokumen,
          perihal: surat.perihal,
          tujuan: surat.tujuan,
          penyusun: surat?.departemen?.nameDepartemen ?? "-",
          pic: surat.pegawai.namaPegawai,
          status_surat:
            surat.status === "S"
              ? "Success"
              : surat.status === "D"
              ? "Draft"
              : surat.status === "C"
              ? "Canceled"
              : surat.status === "CD"
              ? "Canceled"
              : "Terisi",
        };
      });

      await csvWritwer.writeRecords(data);
      res.download("public/CSV/suratkeluar.csv");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/suratkeluar");
    }
  },
};
