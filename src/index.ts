import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { placePurchaseOrder, contactSupplier } from './cogip/application/command/purchase-order';
import { receiveGoods } from './cogip/application/command/receipt-note';
import { processReceivedGoods } from './cogip/application/command/balance';

const eventHandler = (state: any = {}, event: any) => {
  switch (event.type) {
    case 'GOOD_RECEIVED':
      store.dispatch(processReceivedGoods(event.lines))
    break;
    default:
    break;
  }
  console.log(event);
}

let store = createStore(eventHandler, applyMiddleware(thunk));

const main = async () => {
  store.dispatch(placePurchaseOrder(
    [{
      productId: 'iPhone',
      quantity: 12
    }],
    'apple'
  ));
  store.dispatch(placePurchaseOrder(
    [{
      productId: 'galaxy',
      quantity: 4
    }],
    'samsung'
  ));
  store.dispatch(contactSupplier('samsung'));

  store.dispatch(receiveGoods([{
      productId: 'galaxy',
      quantity: 3
    }],
    'samsung'
  ))
}

main();
