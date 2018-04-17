import {saveOrUpdate as saveOrUpdateReceiptNote} from '../../infrastructure/repository/receipt-note';
import Line, {Quantity} from '../../domain/model/line/line';
import ProductId from '../../domain/model/product/product-id';
import ReceiptNote, {ReceiptId, ReceiptNoteEvent} from '../../domain/model/receipt-note/receipt-note';
import SupplierId from '../../domain/model/supplier/supplier-id';
import * as uuid from 'uuid/v1';

interface RawProductLine {
  productId: string;
  quantity: number;
}

export const receiveGoods = (rawLines: RawProductLine[], rawSupplier: string) => async (dispatch: any) => {
  const lines = rawLines.map((rawLine: RawProductLine) =>
    Line.create(ProductId.create(rawLine.productId), Quantity.create(rawLine.quantity))
  );
  const supplier = SupplierId.create(rawSupplier);
  const receiptId = ReceiptId.create(uuid());

  const purchaseOrder = ReceiptNote.create(receiptId, lines, supplier);

  await saveOrUpdateReceiptNote(purchaseOrder);

  dispatch({type: 'GOOD_RECEIVED', id: supplier.id});
  purchaseOrder.events.forEach((event: ReceiptNoteEvent) => {
    return dispatch(event);
  });
};
