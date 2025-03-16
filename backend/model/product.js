var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(productSchema = new Schema({
  url_foto: String,
  desc: String,
  title: String,
  target_redirect_url: String,
  target_download_url: String,
  tipe: String,
  is_delete: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
})),
  (product = mongoose.model("product", productSchema));

module.exports = product;
