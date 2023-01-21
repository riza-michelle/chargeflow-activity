const htmlFormat = require("html-format");

const { Order, Product } = require("../models");
const { handleEvent } = require("../lib/lambda-event");
const { sendMail } = require("../lib/mailer");

async function getEmailBody(order) {
  const itemProducts = [];
  for (const { id, qty } of order.products) {
    const product = await Product.getById(id);
    itemProducts.push([product.name, qty, product.price * qty]);
  }
  let itemBody = `<table>
    <tr><th>Product</th><th>Quantity</th><th>Total</th></tr>
    ${itemProducts.map((p) => `<tr><td>${p.join("</td><td>")}</td></tr>`)}
    <tr><td colspan="3">Total: ${order.total}</td></td>
  </table>`;
  return htmlFormat(`<h4>Order #${order.id}</h4>
    ${itemBody}
  `);
}

async function emailOrder(orderId) {
  const order = await Order.getById(orderId);
  const subject = `Order #${order._id}`;
  const body = await getEmailBody(order);
  await sendMail(order.emailAddress, subject, "", {
    html: body,
  });
  return order;
}

exports.handler = async (event) => {
  return handleEvent(event, async (payload) => {
    return emailOrder(payload.orderId);
  });
};
