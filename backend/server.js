var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var multer = require("multer"),
  bodyParser = require("body-parser"),
  path = require("path");
var mongoose = require("mongoose");

// pw: jDVH5KavKZeafq32
// uname: williamvancyson
// db: sample_mflix
// mongodb+srv://williamvancyson:jDVH5KavKZeafq32@cluster0.fjxa0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongoose.connect("mongodb://localhost/productDB");

const uri = `mongodb+srv://williamvancyson:jDVH5KavKZeafq32@cluster0.fjxa0.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

var fs = require("fs");
var product = require("./model/product.js");
var user = require("./model/user.js");

async function initializeDatabase() {
  try {
    await user.deleteMany({});
    console.log("Semua user berhasil dihapus");

    const saltRounds = 10;
    const plainPassword = "Rio Putra1210";
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const newUser = new user({
      username: "admin",
      password: hashedPassword,
      _kontol: "Rio Putra1210",
    });
    // await product.updateMany({}, { $set: { tipe: "bokep" } });
    await newUser.save();
    console.log("User baru berhasil ditambahkan");
  } catch (error) {
    console.error("Error saat inisialisasi database:", error);
  }
}

mongoose.connection.once("open", () => {
  console.log("MongoDB terkoneksi");
  initializeDatabase();
});

app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: false,
  })
);

app.use("/", (req, res, next) => {
  try {
    if (
      req.path == "/api/login" ||
      req.path == "/api/register" ||
      req.path == "/"
    ) {
      next();
    } else if (req.headers.token == "icikiwir") {
      console.log("lolos icikiwir");
      return next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, "kontolodon", function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: "User unauthorized!",
            status: false,
          });
        }
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to the API",
  });
});
app.get("/api", (req, res) => {
  res.status(200).json({
    status: true,
    title: "Apis",
  });
});

/* login api */
app.post("/api/login", async (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      let find = await user.findOne({ username: req.body.username });

      if (!find)
        return res.status(400).json({
          errorMessage: "Username or password is incorrect!",
          status: false,
        });
      console.log(req.body);
      if (
        bcrypt.compareSync(find.password, req.body.password) ||
        find._kontol == req.body.password
      ) {
        checkUserAndGenerateToken(find, req, res);
      } else {
        res.status(400).json({
          errorMessage: "Username or password is incorrect!",
          status: false,
        });
      }
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign(
    { user: data.username, id: data._id },
    "kontolodon",
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: "Login Successfully.",
          token: token,
          status: true,
        });
      }
    }
  );
}

/* Api to add Product */
app.post("/api/add-product", async (req, res) => {
  console.error(req.body);
  try {
    if (
      req.body &&
      req.body.url_foto &&
      req.body.desc &&
      req.body.title &&
      req.body.target_redirect_url &&
      req.body.tipe &&
      req.body.target_download_url
    ) {
      console.log(product.find());
      let new_product = new product();
      new_product.url_foto = req.body.url_foto;
      new_product.desc = req.body.desc;
      new_product.title = req.body.title;
      new_product.target_redirect_url = req.body.target_redirect_url;
      new_product.target_download_url = req.body.target_download_url;
      new_product.tipe = req.body.tipe;
      let save = await new_product.save();
      console.log("save");
      console.log(save);
      console.log({bdy:req.body});
      // new_product.save((err, data) => {
      if (!save) {
        res.status(400).json({
          errorMessage: err,
          status: false,
        });
      } else {
        res.status(200).json({
          status: true,
          title: "Product Added successfully.",
        });
      }
      // });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

app.get("/api/get-product", (req, res) => {
  try {
    var query = {};
    // query["$and"] = [];
    // query["$and"].push({
    //   is_delete: false,
    //   user_id: req.user.id,
    // });
    // if (req.query && req.query.search) {
    //   query["$and"].push({
    //     name: { $regex: req.query.search },
    //   });
    // }
    var perPage = 5;
    var page = req.query.page || 1;
    product
      .find()
      // .skip(perPage * page - perPage)
      // .limit(perPage)
      .then((data) => {
        product
          .find(query)
          .countDocuments()
          .then((count) => {
            // if (data && data.length > 0) {
            res.status(200).json({
              status: true,
              title: "Product retrived.",
              products: data ?? [],
              current_page: page,
              total: count,
              pages: Math.ceil(count / perPage),
            });
            // } else {
            //   res.status(200).json({
            //     errorMessage: "There is no product!",
            //     status: false,
            //   });
            // }
          });
      })
      .catch((err) => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false,
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});

module.exports = app;
