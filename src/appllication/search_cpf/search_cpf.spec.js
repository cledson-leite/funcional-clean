const AppError = require('../../shared/errors/app-error/AppError')
const Either = require('../../shared/errors/either/Either')
const search_cpf = require('./search_cpf.usecase')

const userRepository = {
    findByCPF: jest.fn()
}

describe('Search CPF useCase', () => {
    it('Should throw AppError if dependencies not provided', () => {
        expect(() => search_cpf({})).toThrow(new AppError(AppError.dependencies))
    })
    it('Should throw AppError if params not provided', async () => {
        const sut = search_cpf({userRepository})
        await expect(() => sut({})).rejects.toThrow(new AppError(AppError.params))
    })
    it('Should return error if CPF not exist', async () => {
        userRepository.findByCPF.mockResolvedValueOnce(null)

        const cpfDTO = {
            CPF: 'CPF_not_exist'
        }
        const sut = search_cpf({userRepository})
        const output = await sut(cpfDTO)
        expect(userRepository.findByCPF).toHaveBeenCalledWith(cpfDTO.CPF);
        expect(userRepository.findByCPF).toHaveBeenCalledTimes(1);
        expect(output.right).toBeNull()
        expect(output.left).toEqual(Either.NotRegister('CPF'))
    })
    it('Should return an user', async () => {
        const userDTO = {
          fullName: "valid_name",
          CPF: "valid_CPF",
          phone: "valid_phone",
          address: "valid_address",
          email: "valid_email",
        };

        userRepository.findByCPF.mockResolvedValueOnce(userDTO)

        const cpfDTO = {
            CPF: 'valid_CPF'
        }
        const sut = search_cpf({userRepository})
        const output = await sut(cpfDTO)
        expect(userRepository.findByCPF).toHaveBeenCalledWith(cpfDTO.CPF);
        expect(userRepository.findByCPF).toHaveBeenCalledTimes(1);
        expect(output.left).toBeNull()
        expect(output.right).toEqual(userDTO)
        expect(output.right.CPF).toBe(cpfDTO.CPF);
    })
})