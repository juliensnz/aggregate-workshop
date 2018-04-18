import Line, {Quantity} from '../../domain/model/line/line';
import {findById, RawBalance, saveOrUpdate} from '../../infrastructure/repository/balance';
import Balance, {BalanceEvent} from '../../domain/model/balance/balance';
import ProductId from '../../domain/model/product/product-id';

export const updateBalances = (lines: Line[]) => async (dispatch: any) => {
  return Promise.all(
    lines.map(async (line: Line) => {
      const bdBalance: RawBalance = await findById(line.product.id);

      const balance =
        null === bdBalance
          ? Balance.create(line.product)
          : Balance.create(ProductId.create(bdBalance.productId.id), Quantity.create(bdBalance.balance));

      const updatedBalance = balance.increase(line.quantity);
      await saveOrUpdate(updatedBalance);

      updatedBalance.events.forEach((event: BalanceEvent) => dispatch(event));
    })
  );
};
