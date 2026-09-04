import { concatBytes, randomBytes } from "@noble/ciphers/utils.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { gcmsiv } from "@noble/ciphers/aes.js";
import { argon2idAsync } from "@noble/hashes/argon2.js";
import { Buffer } from "buffer";

export interface EncryptItemProps {
  masterKey: string;
  itemPlaintext: string;
}
export const encryptItem = async ({
  masterKey,
  itemPlaintext,
}: EncryptItemProps) => {
  const itemBytes = Buffer.from(itemPlaintext, "utf-8");

  const iv = randomBytes(12);
  const msgSalt = sha256(concatBytes(randomBytes(8), itemBytes));

  const aesKey = await argon2idAsync(Buffer.from(masterKey, "utf-8"), msgSalt, {
    dkLen: 32,
    m: 65536,
    p: 1,
    t: 3,
  });

  const cipher = gcmsiv(aesKey, iv).encrypt(itemBytes);

  return Buffer.from(concatBytes(iv, msgSalt, cipher)).toString("base64");
};
