const { handler } = require("../src/handlers/checkout");
const { Product } = require("../src/models");
const uuid = require("uuid");

const mockSendMessage = jest.fn(() => {
  return {
    promise: () => {
      return async () => {};
    },
  };
});

jest.mock("aws-sdk", () => {
  return {
    SQS: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
      };
    }),
  };
});
jest.mock("uuid");

describe("Checkout", () => {
  const payload = {
    emailAddress: "test@email.com",
    products: [{ id: "1234", qty: 2 }],
  };
  const orderTotal = 4;
  const queueUrl = "TEST";

  beforeAll(async () => {
    process.env.QUEUE_URL = queueUrl;
    await Product.create({
      _id: "1234",
      name: "product1",
      price: 2,
    });
  });

  test("checkout handler should call sqs sendMessage", async () => {
    const mockOrderId = "testOrderId";
    uuid.v4.mockReturnValue(mockOrderId);

    await handler(payload);

    expect(mockSendMessage).toHaveBeenCalledWith({
      MessageAttributes: {},
      MessageBody: JSON.stringify({
        orderId: mockOrderId,
      }),
      QueueUrl: queueUrl,
    });
  });

  test("checkout handler should return order", async () => {
    const mockOrderId = "testOrderId2";
    uuid.v4.mockReturnValue(mockOrderId);

    const result = await handler(payload);

    expect(result.body).toEqual({
      _id: mockOrderId,
      id: mockOrderId,
      products: payload.products,
      emailAddress: payload.emailAddress,
      total: orderTotal,
    });
  });
});
