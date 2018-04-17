import Line from '../line/line';
import SupplierId from '../supplier/supplier-id';

class BadTypeError extends Error {}

export interface PurchaseOrderEvent {
  type: string;
}

export class PurchaseId {
  private constructor(readonly id: string) {}

  public static create(id: string) {
    return new PurchaseId(id);
  }
}

export default class PurchaseOrder {
  private constructor(
    readonly purchaseId: PurchaseId,
    readonly lines: Line[],
    readonly supplier: SupplierId,
    readonly placed: boolean,
    readonly events: PurchaseOrderEvent[]
  ) {
    if (!(purchaseId instanceof PurchaseId)) {
      throw new BadTypeError('You need a PurchaseId to create a new purchase order');
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

  public static create(purchaseId: PurchaseId, lines: Line[], supplier: SupplierId) {
    const events = [{type: 'PURCHASE_ORDER_CREATED', id: purchaseId.id}];

    return new PurchaseOrder(purchaseId, lines, supplier, false, events);
  }

  public place(): PurchaseOrder {
    const events = [...this.events, {type: 'PURCHASE_PLACED', id: this.purchaseId.id}];

    return new PurchaseOrder(this.purchaseId, this.lines, this.supplier, true, events);
  }
}
