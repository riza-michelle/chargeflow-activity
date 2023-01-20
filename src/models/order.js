const uuid = require("uuid");

const { getCollection } = require("../lib/db");

class Order {
  static modelName = "order";

  constructor(obj) {
    this._id = obj._id;
    this.id = obj._id;
    this.emailAddress = obj.emailAddress;
    this.products = obj.products;
    this.total = obj.total;
  }

  static async create(emailAddress, products, total) {
    const collection = await getCollection(this.modelName);
    const transaction = await collection.insertOne({
      _id: uuid.v4(),
      emailAddress,
      products,
      total,
    });
    const item = await collection.findOne({ _id: transaction.insertedId });
    return new Order(item);
  }

  static async getById(id) {
    const collection = await getCollection(this.modelName);
    const item = await collection.findOne({ _id: id });
    if (!item) {
      return;
    }
    return new Order(item);
  }
}

module.exports = Order;
