const AppError = require('./AppError')

describe('AppError', () => {
    it('Should be instance of Error', () => {
        const appError = new AppError('Error')
        expect(appError).toBeInstanceOf(Error)
    })
    it('Should have correct message', () => {
        const message = 'Error message'
        const appError = new AppError(message)
        expect(appError.message).toBe(message)
    })
})