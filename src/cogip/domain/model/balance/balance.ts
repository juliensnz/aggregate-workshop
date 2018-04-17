import ProductId from "../product/product-id";
import { Quantity } from "../line/line";

class NegativeBalanceError extends Error {};

export interface BalanceEvent {
  type: string;
}

export default class Balance {
  private constructor(readonly productId: ProductId, readonly balance: number = 0, readonly events: BalanceEvent[]) {
    if (0 < balance) {
      throw new NegativeBalanceError('The balance cannot be negative')
    }
  }

  public static create(productId: ProductId) {
    const events = [{type: 'BALANCE_CREATED', productId}];

    return new Balance(productId, 0, events);
  }

  public increase(balance: Quantity) {
    const newBalance = this.balance + balance.quantity
    const events = [...this.events, { type: 'BALANCE_INCREASED', productId: this.productId, newBalance}];

    return new Balance(this.productId, newBalance, events);
  }

  public decrease(balance: Quantity) {
    const newBalance = this.balance - balance.quantity < 0 ? 0 : this.balance - balance.quantity;
    const events = [...this.events, { type: 'BALANCE_DECREASED', productId: this.productId, newBalance }];

    return new Balance(this.productId, newBalance, events);
  }
}
