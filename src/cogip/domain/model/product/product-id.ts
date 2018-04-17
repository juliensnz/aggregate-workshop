class EmptyStringError extends Error {}

export default class ProductId {
  private constructor(readonly id: string) {
    if (typeof id !== 'string' || id.length === 0) {
      throw new EmptyStringError('The given id to create a ProductId cannot be empty');
    }
  }

  public static create(id: string) {
    return new ProductId(id);
  }
}
