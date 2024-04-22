const AppError = require("../../shared/errors/app-error/AppError");
const Either = require("../../shared/errors/either/Either");

module.exports = function registerUser({ userRepository }) {
  if (!userRepository) throw new AppError(AppError.dependencies);

  return async ({ fullName, CPF, phone, address, email }) => {
    const check = fullName && CPF && phone && address && email;
    if(!check) throw new AppError(AppError.params);
    let isExist = await userRepository.findByCPF(CPF)
    if(isExist) return Either.Left(Either.AlreadyRegister('CPF'), null)
    isExist = await userRepository.findByEmail(email)
    if(isExist) return Either.Left(Either.AlreadyRegister('email'), null)
    await userRepository.register({ fullName, CPF, phone, address, email });
    return Either.Right(null)
  };
};
