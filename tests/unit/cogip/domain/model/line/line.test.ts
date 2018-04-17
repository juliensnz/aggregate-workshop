import Line, {Quantity} from 'cogip/domain/model/line/line';
import ProductIdentifier from 'cogip/domain/model/product/product-id';

test('Similar line are equal', () => {
  expect(Line.create(ProductIdentifier.create('nice'), Quantity.create(12)))
    .toEqual(Line.create(ProductIdentifier.create('nice'), Quantity.create(12)));
});

test('Quantity cannot be lower than 1', () => {
  expect(() => Quantity.create(0))
    .toThrowError('You should not have a negative quantity');
});

test('Quantity should be a number', () => {
  expect(() => Quantity.create('12'))
    .toThrowError('You should pass a number value to create a quantity');
});

test('Should be created with product', () => {
  expect(() => Line.create(Quantity.create(12), Quantity.create(12)))
    .toThrowError('You need a product id to create a new line');
});

test('Should be created with quantity', () => {
  expect(() => Line.create(ProductIdentifier.create('nice'), ProductIdentifier.create('nice')))
    .toThrowError('You need a quantity to create a new line');
});
