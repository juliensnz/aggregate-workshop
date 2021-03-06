import PurchaseOrder from '../../domain/model/purchase-order/purchase-order';
import {readFile, get, writeFile} from './base';

export const findById = async (id: string) => {
  const file = await readFile();

  return get(file, `purchase_order.${id}`);
};

export const findAll = async (): Promise<any[]> => {
  const file = await readFile();
  const purchaseOrders = get(file, `purchase_order`);

  return Object.keys(purchaseOrders).map((key: string) => purchaseOrders[key]);
};

export const saveOrUpdate = async (purchaseOrder: PurchaseOrder) => {
  const file = await readFile();
  const data = JSON.parse(file);

  data['purchase_order'][purchaseOrder.purchaseId.id] = purchaseOrder;

  const updatedFile = JSON.stringify(data);

  return writeFile(updatedFile);
};
