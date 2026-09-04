import { nanoid } from "nanoid";
import { crc8 } from "crc";

export const validateKey = (key: string) => {
  if (key.length != 24) return false;

  const id = key.slice(0, 22);
  const checksum = key.slice(22);
  return checksum == crc8(id).toString(32).padStart(2, "0");
};

export const generateKey = () => {
  const id = nanoid(22);
  const checksum = crc8(id).toString(32).padStart(2, "0");
  return `${id}${checksum}`;
};
