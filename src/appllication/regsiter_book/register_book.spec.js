const AppError = require('../../shared/errors/app-error/AppError')
const Either = require("../../shared/errors/either/Either");
const register_book = require('./register_book.usecase')

const bookRepository = {
    register: jest.fn(),
    findByISBN: jest.fn()
}

describe('Register Book UseCase', () => {
    it('Should throw AppError if dependencies not provided', () => {
        expect(() => register_book({})).toThrow(new AppError(AppError.dependencies))
    })
    it('Should throw AppError if params not provided', async () => {
        const sut = register_book({bookRepository})
        await expect(() => sut({})).rejects.toThrow(new AppError(AppError.params))
    })
    it('Should return error if ISBN already register', async () => {
        bookRepository.findByISBN.mockResolvedValueOnce(true)
        const bookDTO = {
            title: 'any_title',
            quntity: 100,
            author: 'any_author',
            category: 'any_category',
            ISBN: 'any_ISBN'
        };
        const sut = register_book({bookRepository})
        const output = await sut(bookDTO)
        expect(bookRepository.findByISBN).toHaveBeenCalledTimes(1);
        expect(bookRepository.findByISBN).toHaveBeenCalledWith(bookDTO.ISBN);
        expect(output.right).toBeNull()
        expect(output.left).toEqual(Either.AlreadyRegister('ISBN'))
    })
    it('Should return null in success', async () => {
        const bookDTO = {
            title: 'any_title',
            quntity: 100,
            author: 'any_author',
            category: 'any_category',
            ISBN: 'any_ISBN'
        };
        const sut = register_book({bookRepository})
        const output = await sut(bookDTO)
        expect(bookRepository.register).toHaveBeenCalledTimes(1);
        expect(bookRepository.register).toHaveBeenCalledWith(bookDTO);
        expect(output.left).toBeNull()
        expect(output.right).toBeNull()
    })
})