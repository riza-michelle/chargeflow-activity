class ValidationError extends Error {
  constructor(message) {
    this.statusCode = 400;
    super(message);
  }
}

module.exports = { ValidationError };
