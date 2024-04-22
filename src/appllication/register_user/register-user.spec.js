const registerUserUsecase = require("./register-user.usecase");
const AppError = require("../../shared/errors/app-error/AppError");
const Either = require("../../shared/errors/either/Either");

const userRepository = {
  register: jest.fn(),
  findByCPF: jest.fn(),
  findByEmail: jest.fn()
};

describe("Register User UseCase", () => {
  it("Should register new user", async () => {

    const userDTO = {
      fullName: "valid_name",
      CPF: "valid_CPF",
      phone: "valid_phone",
      address: "valid_address",
      email: "valid_email",
    };

    const sut = registerUserUsecase({ userRepository });
    const output = await sut(userDTO);

    expect(output.right).toBeNull();
    expect(userRepository.register).toHaveBeenCalledWith(userDTO);
    expect(userRepository.register).toHaveBeenCalledTimes(1);
  });

  it("Should throw AppError if userDTO not provided", () => {
    expect(() => registerUserUsecase({})).toThrow(
      new AppError(AppError.dependencies)
    );
  });
  it("Should throw AppError if some params not provided", async () => {
    const sut = registerUserUsecase({userRepository})
    await expect(() => sut({})).rejects.toThrow(new AppError(AppError.params));
  });
  it("Should return error if CPF already register", async () => {
    userRepository.findByCPF.mockResolvedValueOnce(true);

    const userDTO = {
      fullName: "valid_name",
      CPF: "CPF_already_register",
      phone: "valid_phone",
      address: "valid_address",
      email: "valid_email",
    };

    const sut = registerUserUsecase({ userRepository });
    const output = await sut(userDTO);
    expect(userRepository.findByCPF).toHaveBeenCalledWith(userDTO.CPF);
    expect(userRepository.findByCPF).toHaveBeenCalledTimes(1);
    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.AlreadyRegister("CPF"));
  });
  it("Should return error if email already register", async () => {
    userRepository.findByEmail.mockResolvedValueOnce(true)
    
    const userDTO = {
      fullName: "email_already_register",
      CPF: "valid_CPF",
      phone: "valid_phone",
      address: "valid_address",
      email: "valid_email",
    };

    const sut = registerUserUsecase({userRepository})
    const output = await sut(userDTO)
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userDTO.email);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.AlreadyRegister('email'));
  });
});
