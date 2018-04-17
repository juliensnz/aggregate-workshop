import ProductIdentifier from '../product/product-id';

class NegativeQuantityError extends Error {}
class BadTypeError extends Error {}
class UndefinedProduct extends Error {}

export class Quantity {
  private constructor(readonly quantity: number) {
    if ('number' !== typeof quantity) {
      throw new BadTypeError('You should pass a number value to create a quantity');
    }

    if (quantity <= 0) {
      throw new NegativeQuantityError('You should not have a negative quantity');
    }
  }

  public static create(quantity: number): Quantity {
    return new Quantity(quantity);
  }
}

export default class Line {
  private constructor(readonly product: ProductIdentifier, readonly quantity: Quantity) {
    if (!(product instanceof ProductIdentifier)) {
      throw new UndefinedProduct('You need a product id to create a new line');
    }

    if (!(quantity instanceof Quantity)) {
      throw new UndefinedProduct('You need a quantity to create a new line');
    }
  }

  public static create(product: ProductIdentifier, quantity: Quantity): Line {
    return new Line(product, quantity);
  }
}
