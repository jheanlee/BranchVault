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
