const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
let kurirSchema = mongoose.Schema(
  {
    kurirName: {
      type: String,
      require: [true | "Nama kurir harus di isi"],
    },
    urlTracking: {
      type: String,
      default: "-",
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
kurirSchema.plugin(mongoose_delete, {
  deleteAt: true,
});
module.exports = mongoose.model("Kurir", kurirSchema);
