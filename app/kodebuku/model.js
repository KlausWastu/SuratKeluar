const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
let kodebukuSchema = mongoose.Schema(
  {
    kodedokumen: {
      type: String,
      require: [true | "Kode DOkumen harus di isi"],
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
kodebukuSchema.plugin(mongoose_delete, {
  deleteAt: true,
});
module.exports = mongoose.model("KodeBuku", kodebukuSchema);
