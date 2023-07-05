const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
let departemenSchema = mongoose.Schema(
  {
    nameDepartemen: {
      type: String,
      require: [true | "Nama departemen harus di isi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
departemenSchema.plugin(mongoose_delete, {
  deleteAt: true,
});
module.exports = mongoose.model("Departemen", departemenSchema);
