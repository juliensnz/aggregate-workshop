class EmptyStringError extends Error {};

export default class SupplierId {
  private constructor(readonly id: string) {
    if (typeof(id) !== 'string' || id.length === 0) {
      throw new EmptyStringError('The given id to create a SupplierId cannot be empty');
    }
  }

  public static create(id: string) {
    return new SupplierId(id);
  }
}
