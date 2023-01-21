const { getCollection } = require("../lib/db");

class Product {
  static modelName = "product";

  constructor(obj) {
    this._id = obj._id;
    this.id = obj._id;
    this.price = obj.price;
    this.name = obj.name;
  }

  static async create(params) {
    const collection = await getCollection(this.modelName);
    const transaction = await collection.insertOne(params);
    const item = await collection.findOne({ _id: transaction.insertedId });
    return new Product(item);
  }

  static async getAll() {
    const collection = await getCollection(this.modelName);
    const items = await collection.find({}).toArray();
    return items.map((i) => new Product(i));
  }

  static async getById(id) {
    const collection = await getCollection(this.modelName);
    const item = await collection.findOne({ _id: id });
    if (!item) {
      return;
    }
    return new Product(item);
  }
}

module.exports = Product;
