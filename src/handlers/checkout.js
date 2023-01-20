const { Order, Product } = require("../models");
const { sendSQSMessage } = require("../lib/sqs");

const QUEUE_URL = process.env.QUEUE_URL;

async function createOrder(emailAddress, products) {
  if (!emailAddress || !emailAddress.match(/.*\@.*\.\w{2,3}/g)) {
    throw new Error("Invalid email address.");
  }
  if (!products || !products.length) {
    throw new Error("Invalid product.");
  }
  let total = 0;
  for (const { id, qty } of products) {
    const product = await Product.getById(id);
    if (!product || !qty) {
      throw new Error("Invalid product.");
    }
    total += product.price * qty;
  }
  const order = await Order.create(emailAddress, products, total);
  await sendSQSMessage(QUEUE_URL, JSON.stringify({ orderId: order.id }));
  return order;
}

exports.createOrder = async (data) => {
  return createOrder(data.emailAddress, data.products);
};
