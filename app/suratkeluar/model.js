const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
let suratkeluarSchema = mongoose.Schema(
  {
    noDokumen: {
      type: String,
    },
    kodebuku: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KodeBuku",
    },
    departemen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departemen",
    },
    pegawai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pegawai",
    },
    tanggal: {
      type: String,
      require: [true | "Tanggal harus di isi"],
    },
    perihal: {
      type: String,
      require: [true | "Perihal harus di isi"],
    },
    tujuan: {
      type: String,
      require: [true | "Tujuan harus di isi"],
    },
    uploadPdf: {
      type: String,
    },
    status: {
      type: String,
      enum: ["S", "D", "C", "T"],
      default: "D",
    },
    statusskkirim: {
      type: Boolean,
      default: false,
    },
    statuscancel: {
      type: Boolean,
      default: false,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
suratkeluarSchema.plugin(mongoose_delete, {
  deleteAt: true,
});
module.exports = mongoose.model("SuratKeluar", suratkeluarSchema);
