import Line, { Quantity } from 'cogip/domain/model/line/line';
import ProductId from 'cogip/domain/model/product/product-id';
import SupplierId from 'cogip/domain/model/supplier/supplier-id';
import PurchaseOrder, { PurchaseId } from 'cogip/domain/model/purchase-order/purchase-order';

test('Can create a purchase order', () => {
  const line = Line.create(ProductId.create('nice'), Quantity.create(12));
  const supplierId = SupplierId.create('supplier');
  const purchaseId = PurchaseId.create('purchase');
  const order = PurchaseOrder.create(purchaseId, [line], supplierId);

  expect(order.events[0])
    .toEqual({ type: 'PURCHASE_ORDER_CREATED', id: 'purchase' })
  expect(order.placed)
    .toEqual(false);

  const placedOrder = order.place();

  expect(placedOrder.placed)
    .toEqual(true);
  expect(placedOrder.events[1])
    .toEqual({ type: 'PURCHASE_PLACED', id: 'purchase' })
});
