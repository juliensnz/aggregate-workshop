import Line from '../line/line';
import SupplierId from '../supplier/supplier-id';

class BadTypeError extends Error { };

export interface ReceiptNoteEvent {
  type: string;
}

export class ReceiptId {
  private constructor(readonly id: string) { }

  public static create(id: string) {
    return new ReceiptId(id);
  }
}

export default class ReceiptNote {
  private constructor(
    readonly receiptId: ReceiptId,
    readonly lines: Line[],
    readonly supplier: SupplierId,
    readonly events: ReceiptNoteEvent[]
  ) {
    if (!(receiptId instanceof ReceiptId)) {
      throw new BadTypeError('You need a ReceiptId to create a new purchase order');
    }

    if (!(lines instanceof Array)) {
      throw new BadTypeError('You need an array of Lines to create a purchase order');
    }

    if (0 === lines.length) {
      throw new BadTypeError('You need a non empty array of Lines to create a purchase order');
    }

    if (!(supplier instanceof SupplierId)) {
      throw new BadTypeError('You need a SupplierId to create a new purchase order');
    }
  }

  public static create(receiptId: ReceiptId, lines: Line[], supplier: SupplierId) {
    const events = [{ type: 'RECEIPT_NOTE_CREATED', id: receiptId.id, lines }];

    return new ReceiptNote(receiptId, lines, supplier, events);
  }
}
