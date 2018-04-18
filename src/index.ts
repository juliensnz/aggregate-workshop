import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {placePurchaseOrder, contactSupplier, updatePurchaseOrders} from './cogip/application/command/purchase-order';
import {receiveGoods} from './cogip/application/command/receipt-note';
import {updateBalances} from './cogip/application/command/balance';

const processReceivedGoods = (lines: any) => async (dispatch: any) => {
  await dispatch(updateBalances(lines));
  await dispatch(updatePurchaseOrders(lines));
};

const eventHandler = (state: any = {}, event: any) => {
  switch (event.type) {
    case 'GOOD_RECEIVED':
      store.dispatch(processReceivedGoods(event.lines));
      break;
    default:
      break;
  }
  console.log(event);
};

let store = createStore(eventHandler, applyMiddleware(thunk));

const main = async () => {
  await store.dispatch(
    placePurchaseOrder(
      [
        {
          productId: 'iPhone',
          quantity: 12,
        },
      ],
      'apple'
    )
  );
  await store.dispatch(
    placePurchaseOrder(
      [
        {
          productId: 'galaxy',
          quantity: 4,
        },
      ],
      'samsung'
    )
  );
  await store.dispatch(contactSupplier('samsung'));

  await store.dispatch(
    receiveGoods(
      [
        {
          productId: 'galaxy',
          quantity: 3,
        },
      ],
      'samsung'
    )
  );
  await store.dispatch(contactSupplier('apple'));
};

main();
