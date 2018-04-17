import Line from '../../domain/model/line/line';
import { findById, RawBalance, saveOrUpdate } from '../../infrastructure/repository/balance';
import Balance, { BalanceEvent } from '../../domain/model/balance/balance';
import ProductId from '../../domain/model/product/product-id';

export const processReceivedGoods = (lines: Line[]) => async (dispatch: any) => {
  lines.forEach(async (line: Line) => {
    const bdBalance: RawBalance = await findById(line.product.id);

    const balance = undefined === bdBalance ?
      Balance.create(line.product) :
      Balance.create(ProductId.create(bdBalance.productId));

    const updatedBalance = balance.increase(line.quantity);
    await saveOrUpdate(updatedBalance);

    balance.events.forEach((event: BalanceEvent) => dispatch(event));
  })

  // const lines = rawLines.map((rawLine: RawProductLine) => (
  //   Line.create(ProductId.create(rawLine.productId), Quantity.create(rawLine.quantity))
  // ));
  // const supplier = SupplierId.create(rawSupplier);
  // const receiptId = ReceiptId.create(uuid());

  // const purchaseOrder = ReceiptNote.create(receiptId, lines, supplier);

  // await saveOrUpdateReceiptNote(purchaseOrder);

  // dispatch({ type: 'GOOD_RECEIVED', id: supplier.id });
  // purchaseOrder.events.forEach((event: ReceiptNoteEvent) => {
  //   return dispatch(event);
  // });
}
