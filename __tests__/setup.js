global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();

  process.env.MONGODB_URI = await mongod.getUri();

  global.__MONGOD__ = mongod;
};
