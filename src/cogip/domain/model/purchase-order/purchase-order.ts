import Line, {Quantity} from '../line/line';
import SupplierId from '../supplier/supplier-id';
import ProductId from '../product/product-id';

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
    readonly received: Line[],
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

    return new PurchaseOrder(purchaseId, lines, supplier, [], false, events);
  }

  public static createFromRaw(rawPurchase: any) {
    return new PurchaseOrder(
      PurchaseId.create(rawPurchase.purchaseId.id),
      rawPurchase.lines.map((line: any) =>
        Line.create(ProductId.create(line.product.id), Quantity.create(line.quantity.quantity))
      ),
      SupplierId.create(rawPurchase.supplier.id),
      rawPurchase.received.map((line: any) =>
        Line.create(ProductId.create(line.product.id), Quantity.create(line.quantity.quantity))
      ),
      rawPurchase.placed,
      []
    );
  }

  public place(): PurchaseOrder {
    const events = [...this.events, {type: 'PURCHASE_PLACED', id: this.purchaseId.id}];

    return new PurchaseOrder(this.purchaseId, this.lines, this.supplier, this.received, true, events);
  }

  public receiveGoods(line: Line): PurchaseOrder {
    const receivedLine = this.received.find((line: Line) => line.product.id === line.product.id);
    const newQuantity = undefined === receivedLine ?
      line.quantity :
      Quantity.create(line.quantity.quantity + receivedLine.quantity.quantity);

    const updatedLine = Line.create(line.product, newQuantity);
    const filteredReceived = this.received.filter((line: Line) => line.product.id !== line.product.id);

    const received = [...filteredReceived, updatedLine];
    const events = [...this.events, {type: 'PURCHASE_RECEIVE_GOODS', id: this.purchaseId.id, line}];

    return new PurchaseOrder(this.purchaseId, this.lines, this.supplier, received, true, events);
  }

  private getMissing(): Line[] {
    return this.lines
      .map((line: Line) => {
        const receivedLine = this.received.find((receivedLine: Line) => receivedLine.product.id === line.product.id);

        return undefined === receivedLine
          ? line
          : Line.create(line.product, Quantity.create(
            (line.quantity.quantity > receivedLine.quantity.quantity) ?
              line.quantity.quantity - receivedLine.quantity.quantity :
              0
            ));
      })
      .filter((line: Line) => line.quantity.quantity > 0);
  }



  public isCompleteForProduct(productId: ProductId): boolean {
    const isProductMissing = undefined !== this.getMissing().find((line: Line) => line.product.id === productId.id);

    return !isProductMissing;
  }
}
