const { Product } = require("../models");

async function getProducts() {
  return Product.getAll();
}

module.exports = {
  getProducts,
};
