const AppError = require("../../shared/errors/app-error/AppError");
const Either = require("../../shared/errors/either/Either");

module.exports = function LoanBook({ loanRepository }) {
  if (!loanRepository) throw new AppError(AppError.dependencies);
  return async ({user_id, book_id, return_date, departure_date}) => {
    const check = user_id && book_id && return_date && departure_date
    if(!check) throw new AppError(AppError.params);
    const isPending = await loanRepository.check_pending(user_id, book_id);
    if(isPending) return Either.Left(Either.BookPending())
    if(return_date > departure_date) {
      return Either.Left(Either.DateError());
    }
    await loanRepository.loan({
      user_id,
      book_id,
      return_date,
      departure_date,
    });
    return Either.Right(null)
  }
};
