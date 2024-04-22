const AppError = require("../../shared/errors/app-error/AppError");
const Either = require("../../shared/errors/either/Either");
const search_ISBN = require("./search_ISBN.usecase");

const bookRepository = {
  findByISBN: jest.fn(),
};

describe("Search Book UseCase", () => {
  it("Should throw AppError if dependencies not provided", () => {
    expect(() => search_ISBN({})).toThrow(new AppError(AppError.dependencies));
  });
  it("Should throw AppError if params not provided", async () => {
    const sut = search_ISBN({ bookRepository });
    await expect(() => sut({})).rejects.toThrow(new AppError(AppError.params));
  });
  it("Should return error if ISBN not exist", async () => {
    bookRepository.findByISBN.mockResolvedValueOnce(null);

    const isbnDTO = {
      ISBN: "ISBN_not_exist",
    };
    const sut = search_ISBN({ bookRepository });
    const output = await sut(isbnDTO);
    expect(bookRepository.findByISBN).toHaveBeenCalledWith(isbnDTO.ISBN);
    expect(bookRepository.findByISBN).toHaveBeenCalledTimes(1);
    expect(output.right).toBeNull();
    expect(output.left).toEqual(Either.NotRegister("ISBN"));
  });
  it("Should return an book", async () => {
    const bookDTO = {
      title: "any_title",
      quntity: 100,
      author: "any_author",
      category: "any_category",
      ISBN: "any_ISBN",
    };

    bookRepository.findByISBN.mockResolvedValueOnce(bookDTO);

    const isbnDTO = {
      ISBN: "ISBN_valid",
    };
    const sut = search_ISBN({ bookRepository });
    const output = await sut(isbnDTO);
    expect(bookRepository.findByISBN).toHaveBeenCalledTimes(1);
    expect(bookRepository.findByISBN).toHaveBeenCalledWith(isbnDTO.ISBN);
    expect(output.left).toBeNull();
    expect(output.right).toEqual(bookDTO);
    expect(output.right.ISBN).toBe(bookDTO.ISBN);
  });
});
