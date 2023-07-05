const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
let pegawaiSchema = mongoose.Schema(
  {
    namaPegawai: {
      type: String,
      require: [true | "Nama pegawai harus di isi"],
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
pegawaiSchema.plugin(mongoose_delete, {
  deleteAt: true,
});
module.exports = mongoose.model("Pegawai", pegawaiSchema);
