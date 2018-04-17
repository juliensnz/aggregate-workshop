import { readFile, get, writeFile } from './base';
import Balance from "../../domain/model/balance/balance";

export interface RawBalance {
  productId: string;
  balance: number;
}

export const findById = async (id: string) => {
  const file = await readFile();

  return get(file, `balance.${id}`);
}

export const saveOrUpdate = async (balance: Balance) => {
  const file = await readFile();
  const data = JSON.parse(file);

  data['balance'][balance.productId.id] = balance;

  const updatedFile = JSON.stringify(data);

  return writeFile(updatedFile);
}
