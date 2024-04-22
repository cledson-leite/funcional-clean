module.exports = class AppError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }
  static dependencies = "Some dependencies were not provided";
  static params = "Some mandatory parameters were not provided";
};