const uuid = require("uuid");
const htmlFormat = require("html-format");

const { handler } = require("../src/handlers/email");
const { Order, Product } = require("../src/models");

const mockSendMail = jest.fn();

jest.mock("uuid");
jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn().mockImplementation(() => {
      return {
        sendMail: mockSendMail,
      };
    }),
  };
});

describe("Email", () => {
  let mockOrder, mockProduct;
  const email = "test@gmail.com";
  const sender = "testSender";

  beforeAll(async () => {
    process.env.MAIL_SENDER = sender;
    uuid.v4.mockReturnValue("testOrderId");
    mockProduct = await Product.create({
      _id: "1234",
      name: "product1",
      price: 2,
    });
    mockOrder = await Order.create(email, [{ id: mockProduct.id, qty: 3 }], 6);
  });

  test("email handler should send email", async () => {
    await handler({ orderId: mockOrder.id });
    const expectedBody = `<h4>Order #${mockOrder.id}</h4>
    <table>
      <tr><th>Product</th><th>Quantity</th><th>Total</th></tr>
      <tr><td>${mockProduct.name}</td><td>3</td><td>6</td></tr>
      <tr><td colspan="3">Total: 6</td></td>
    </table>
    `;
    expect(mockSendMail).toHaveBeenCalledWith({
      from: sender,
      to: mockOrder.emailAddress,
      subject: `Order #${mockOrder.id}`,
      text: "",
      html: htmlFormat(expectedBody),
    });
  });
});
