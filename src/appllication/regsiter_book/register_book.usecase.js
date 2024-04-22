const AppError = require('../../shared/errors/app-error/AppError')
const Either = require('../../shared/errors/either/Either')

module.exports = function registerBook({bookRepository}){

    if(!bookRepository) throw new AppError(AppError.dependencies)
    return async ({title, quntity, author, category, ISBN}) => {
        const check = title && quntity && author && category && ISBN;
        if(!check) throw new AppError(AppError.params)
        const isExist = await bookRepository.findByISBN(ISBN)
        if(isExist) return Either.Left(Either.AlreadyRegister('ISBN'))
        await bookRepository.register({
          title,
          quntity,
          author,
          category,
          ISBN,
        });
        return Either.Right(null)
    }
}