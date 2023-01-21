const { Product } = require("../models");
const { handleEvent } = require("../lib/lambda-event");

async function getProducts() {
  return Product.getAll();
}

exports.handler = async (event) => {
  return handleEvent(event, getProducts);
};
