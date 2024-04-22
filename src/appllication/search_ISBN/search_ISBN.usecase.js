const AppError = require("../../shared/errors/app-error/AppError");
const Either = require("../../shared/errors/either/Either");

module.exports = function search_ISBN({ bookRepository }) {
  if (!bookRepository) throw new AppError(AppError.dependencies);
  return async ({ISBN}) => {
    if(!ISBN) throw new AppError(AppError.params);
    const book = await bookRepository.findByISBN(ISBN)
    if(!book) return Either.Left(Either.NotRegister('ISBN'))
    return Either.Right(book)
  }
};
