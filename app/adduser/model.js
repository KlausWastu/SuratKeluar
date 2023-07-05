const mongoose = require("mongoose");
let addUserSchema = mongoose.Schema(
  {
    departemen: {
      type: String,
      require: [true | "Nama departemen harus di isi"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adduser", addUserSchema);
