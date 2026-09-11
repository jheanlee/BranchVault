/*
 * Copyright 2026 Jhe-An Lee
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * format of encrypted item:
 * +-----------------------+---------------------------------------------+----------------+
 * | Initialization Vector | Message Salt                                | Payload        |
 * | AES init              | used in KDF (Argon2id)                      | encrypted data |
 * | 16 Bytes              | 32 Bytes                                    |                |
 * | random bytes          | SHA-256 hash of 16 random bytes + Plaintext |                |
 * +-----------------------+---------------------------------------------+----------------+
 *
 */

import { gcmsiv } from "@noble/ciphers/aes.js";
import { argon2idAsync } from "@noble/hashes/argon2.js";
import { Buffer } from "buffer";

export interface DecryptItemProps {
  masterKey: string;
  encryptedItem: string;
}
export const decryptItem = async ({
  masterKey,
  encryptedItem,
}: DecryptItemProps) => {
  const bytes = Buffer.from(encryptedItem, "base64");

  const iv = bytes.subarray(0, 12);
  const msgSalt = bytes.subarray(12, 44);
  const data = bytes.subarray(44);

  const aesKey = await argon2idAsync(Buffer.from(masterKey, "utf-8"), msgSalt, {
    dkLen: 32,
    m: 65536,
    p: 1,
    t: 3,
  });

  return Buffer.from(gcmsiv(aesKey, iv).decrypt(data)).toString("utf-8");
};
