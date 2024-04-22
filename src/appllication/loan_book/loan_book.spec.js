const AppError = require('../../shared/errors/app-error/AppError')
const Either = require('../../shared/errors/either/Either')
const LoanBook = require('./loan_book.usecase')

const loanRepository = {
    loan: jest.fn(),
    check_pending: jest.fn()
}

describe('Loan Book UseCase', () => {
    it('Should throw AppError if dependencies not provided', () => {
        expect(() => LoanBook({})).toThrow(new AppError(AppError.dependencies))
    })
    it('Should throw AppError if params not provided', async () => {
        const sut = LoanBook({ loanRepository})
        await expect(() => sut({})).rejects.toThrow(new AppError(AppError.params))
    })
    it("Should return erro if user have the same pending book", async () => {
        loanRepository.check_pending.mockResolvedValueOnce(true)
        const loanDTO = {
            user_id: 'id_valid',
            book_id: 'id_valid',
            return_date: 'date_valid',
            departure_date: 'date_valid'
        }
      const sut = LoanBook({ loanRepository });
      const output = await sut(loanDTO)
      expect(loanRepository.check_pending).toHaveBeenCalledWith(loanDTO.user_id, loanDTO.book_id)
      expect(loanRepository.check_pending).toHaveBeenCalledTimes(1)
      expect(output.right).toBeNull()
      expect(output.left).toEqual(Either.BookPending())
      
    });
    it("Should return erro when the return date is greater than the departure date", async () => {
      const loanDTO = {
        user_id: "id_valid",
        book_id: "id_valid",
        return_date: Date.now() + 2000,
        departure_date: Date.now(),
      };
      const sut = LoanBook({ loanRepository });
      const output = await sut(loanDTO);
      expect(output.right).toBeNull();
      expect(output.left).toEqual(Either.DateError());
    });
    it("Should return null if success", async () => {
      const loanDTO = {
        user_id: "id_valid",
        book_id: "id_valid",
        return_date: "date_valid",
        departure_date: 'date_valid',
      };
      const sut = LoanBook({ loanRepository });
      const output = await sut(loanDTO);
      expect(loanRepository.loan).toHaveBeenCalledTimes(1);
      expect(loanRepository.loan).toHaveBeenCalledWith(loanDTO);
      expect(output.right).toBeNull();
      expect(output.left).toBeNull();
    });
})