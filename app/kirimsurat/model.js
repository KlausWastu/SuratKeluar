const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
let kirimsuratSchema = mongoose.Schema(
  {
    nodokumen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuratKeluar",
    },
    kurir: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kurir",
    },
    namaHandCarry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pegawai",
    },
    tanggalKirim: {
      type: String,
      require: [true | "Tanggal Kirim harus di isi"],
    },
    tanggalTerima: {
      type: String,
      require: [true | "Tanggal harus Terima di isi"],
    },
    noresi: {
      type: String,
    },
    penerima: {
      type: String,
    },
    statusKirim: {
      type: String,
      enum: ["D", "T", "R"],
      default: "D",
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
kirimsuratSchema.plugin(mongoose_delete, {
  deleteAt: true,
});
module.exports = mongoose.model("KirimSurat", kirimsuratSchema);
