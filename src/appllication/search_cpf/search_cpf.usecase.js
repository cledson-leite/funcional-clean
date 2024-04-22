const AppError = require('../../shared/errors/app-error/AppError');
const Either = require('../../shared/errors/either/Either');

module.exports = function searchCPF({userRepository}) {
    if(!userRepository) throw new AppError(AppError.dependencies)
    return async ({CPF}) => {
        if(!CPF) throw new AppError(AppError.params);
        const user = await userRepository.findByCPF(CPF)
        if (!user) return Either.Left(Either.NotRegister('CPF'));
        return Either.Right(user)
    }
}