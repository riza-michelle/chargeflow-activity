const { Order, Product } = require("../models");
const { sendSQSMessage } = require("../lib/sqs");
const { handleEvent } = require("../lib/lambda-event");
const { ValidationError } = require("../lib/error");

async function createOrder(emailAddress, products) {
  if (!emailAddress || !emailAddress.match(/.*\@.*\.\w{2,3}/g)) {
    throw new ValidationError("Invalid email address.");
  }
  if (!products || !products.length) {
    throw new ValidationError("Invalid product.");
  }
  let total = 0;
  for (const { id, qty } of products) {
    const product = await Product.getById(id);
    if (!product || !qty) {
      throw new ValidationError("Invalid product.");
    }
    total += product.price * qty;
  }
  const order = await Order.create(emailAddress, products, total);
  await sendSQSMessage(
    process.env.QUEUE_URL,
    JSON.stringify({ orderId: order.id })
  );
  return order;
}

exports.handler = async (event) => {
  return handleEvent(event, async (payload) => {
    return createOrder(payload.emailAddress, payload.products);
  });
};
