const mongoose = require("mongoose");
let adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true | "Email harus di isi"],
    },
    password: {
      type: String,
      require: [true | "Kata Sandi harus di isi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    name: {
      type: String,
      require: [true | "Nama harus di isi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
