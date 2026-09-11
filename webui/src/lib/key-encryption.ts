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
