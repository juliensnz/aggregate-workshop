import ReceiptNote from "../../domain/model/receipt-note/receipt-note";
import { readFile, get, writeFile } from './base';

export const findById = async (id: string) => {
  const file = await readFile();

  return get(file, `receipt_note.${id}`);
}

export const saveOrUpdate = async (receiptNote: ReceiptNote) => {
  const file = await readFile();
  const data = JSON.parse(file);

  data['receipt_note'][receiptNote.receiptId.id] = receiptNote;

  const updatedFile = JSON.stringify(data);

  return writeFile(updatedFile);
}
