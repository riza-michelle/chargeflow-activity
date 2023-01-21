const { handler } = require("../src/handlers/catalog");
const { Product } = require("../src/models");

describe("Catalog", () => {
  test("catalog handler should return product list", async () => {
    const product = await Product.create({
      name: "product1",
      price: 2,
    });
    const products = await handler({});
    expect(products.body.length).toBe(1);
    expect(products.body[0]).toEqual(product);
  });
});
