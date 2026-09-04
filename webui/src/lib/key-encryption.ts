import { concatBytes, randomBytes } from "@noble/ciphers/utils.js";
import { gcmsiv } from "@noble/ciphers/aes.js";
import { argon2idAsync } from "@noble/hashes/argon2.js";
import { Buffer } from "buffer";

export interface GetEncryptedKeyProps {
  masterPassword: string;
  key: string;
}
export const getEncryptedKey = async ({
  masterPassword,
  key,
}: GetEncryptedKeyProps) => {
  const kdfSalt = randomBytes(8);
  const iv = randomBytes(12);

  const keyHash = await argon2idAsync(masterPassword, kdfSalt, {
    dkLen: 32,
    m: 65536,
    p: 1,
    t: 3,
  });

  const keyBytes = Buffer.from(key, "utf-8");

  const cipher = gcmsiv(keyHash, iv).encrypt(keyBytes);

  return Buffer.from(concatBytes(kdfSalt, iv, cipher)).toString("base64");
};
