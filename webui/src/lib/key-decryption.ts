import { gcmsiv } from "@noble/ciphers/aes.js";
import { argon2idAsync } from "@noble/hashes/argon2.js";
import { Buffer } from "buffer";

export interface GetDecryptedKeyProps {
  masterPassword: string;
  key: string;
}
export const getDecryptedKey = async ({
  masterPassword,
  key,
}: GetDecryptedKeyProps) => {
  const bytes = Buffer.from(key, "base64");

  const kdfSalt = bytes.subarray(0, 8);
  const iv = bytes.subarray(8, 20);
  const text = bytes.subarray(20);

  const keyHash = await argon2idAsync(masterPassword, kdfSalt, {
    dkLen: 32,
    m: 65536,
    p: 1,
    t: 3,
  });

  return Buffer.from(gcmsiv(keyHash, iv).decrypt(text)).toString("utf-8");
};
