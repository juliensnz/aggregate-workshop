import {saveOrUpdate as saveOrUpdatePurchaseOrder, findAll} from '../../infrastructure/repository/purchase-order';
import Line, {Quantity} from '../../domain/model/line/line';
import ProductId from '../../domain/model/product/product-id';
import PurchaseOrder, {PurchaseId, PurchaseOrderEvent} from '../../domain/model/purchase-order/purchase-order';
import SupplierId from '../../domain/model/supplier/supplier-id';
import * as uuid from 'uuid/v1';

interface RawProductLine {
  productId: string;
  quantity: number;
}

export const placePurchaseOrder = (rawLines: RawProductLine[], rawSupplier: string) => async (dispatch: any) => {
  const lines = rawLines.map((rawLine: RawProductLine) =>
    Line.create(ProductId.create(rawLine.productId), Quantity.create(rawLine.quantity))
  );
  const supplier = SupplierId.create(rawSupplier);
  const purchaseId = PurchaseId.create(uuid());

  const purchaseOrder = PurchaseOrder.create(purchaseId, lines, supplier);
  const placedPurchaseOrder = purchaseOrder.place();

  await saveOrUpdatePurchaseOrder(placedPurchaseOrder);

  placedPurchaseOrder.events.forEach((event: PurchaseOrderEvent) => {
    return dispatch(event);
  });
};

export const contactSupplier = (id: string) => {
  return {type: 'SUPPLIER_CONTACTED', id};
};

export const updatePurchaseOrders = (lines: Line[]) => async (dispatch: any) => {
  const rawPurchaseOrders = await findAll();
  const purchaseOrders = rawPurchaseOrders.map((rawPurchase: any) => PurchaseOrder.createFromRaw(rawPurchase));

  return Promise.all(
    lines.map(async (line: Line) => {
      const notCompletePurchaseOrder: PurchaseOrder | undefined = purchaseOrders.find(
        (purchaseOrder: PurchaseOrder) => !purchaseOrder.isCompleteForProduct(line.product)
      );

      if (undefined !== notCompletePurchaseOrder) {
        const completedPurchaseOrder = notCompletePurchaseOrder.receiveGoods(line);

        await saveOrUpdatePurchaseOrder(completedPurchaseOrder);
        completedPurchaseOrder.events.forEach((event: PurchaseOrderEvent) => {
          return dispatch(event);
        });
      }
    })
  );
};
