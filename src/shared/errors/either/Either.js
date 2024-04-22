module.exports = class Either {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  static Left(left) {
    return new Either(left, null);
  }

  static Right(right) {
    return new Either(null, right);
  }

  static AlreadyRegister(value) {
    return { message: `${value} already registered` };
  }

  static NotRegister(value) {
    return { message: `${value} not registered` };
  }

  static BookPending() {
    return { message: `Book is already on loan and pending return` };
  }
  
  static DateError() {
    return { message: `The return date is greater than the departure date` };
  }
};