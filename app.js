var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
// const ejsLint = require("ejs-lint");

const dashboardRouter = require("./app/dashboard/router");
const departemenRouter = require("./app/departemen/router");
const kodebukuRouter = require("./app/kodebuku/router");
const kurirRouter = require("./app/kurir/router");
const suratkeluarRouter = require("./app/suratkeluar/router");
const kirimsuratRouter = require("./app/kirimsurat/router");
const adminRouter = require("./app/admin/router");
const adduserRouter = require("./app/adduser/router");
const pegawaiRouter = require("./app/pegawai/router");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte"))
);

app.use("/", adminRouter);
app.use("/adduser", adduserRouter);
app.use("/dashboard", dashboardRouter);
app.use("/departemen", departemenRouter);
app.use("/pegawai", pegawaiRouter);
app.use("/kodebuku", kodebukuRouter);
app.use("/kurir", kurirRouter);
app.use("/suratkeluar", suratkeluarRouter);
app.use("/kirimsurat", kirimsuratRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
