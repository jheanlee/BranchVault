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

import { decryptItem, type DecryptItemProps } from "@/lib/item-decryption.ts";
import { encryptItem, type EncryptItemProps } from "@/lib/item-encryption.ts";
import {
  getDecryptedKey,
  type GetDecryptedKeyProps,
} from "@/lib/key-decryption.ts";
import {
  getEncryptedKey,
  type GetEncryptedKeyProps,
} from "@/lib/key-encryption.ts";

export interface ItemDecryptionRequest {
  id: string;
  type: "item-decryption";
  payload: DecryptItemProps;
}
export interface ItemEncryptionRequest {
  id: string;
  type: "item-encryption";
  payload: EncryptItemProps;
}
export interface KeyDecryptionRequest {
  id: string;
  type: "key-decryption";
  payload: GetDecryptedKeyProps;
}
export interface KeyEncryptionRequest {
  id: string;
  type: "key-encryption";
  payload: GetEncryptedKeyProps;
}

export type CryptoWorkerRequest =
  | ItemDecryptionRequest
  | ItemEncryptionRequest
  | KeyDecryptionRequest
  | KeyEncryptionRequest;

export type CryptoWorkerResponse =
  | {
      id: string;
      success: true;
      result: string;
    }
  | {
      id: string;
      success: false;
      error: string;
    };

self.onmessage = async (event: MessageEvent<CryptoWorkerRequest>) => {
  const { id, type, payload } = event.data;

  try {
    let result: string;

    switch (type) {
      case "item-decryption":
        result = await decryptItem(payload);
        break;
      case "item-encryption":
        result = await encryptItem(payload);
        break;
      case "key-decryption":
        result = await getDecryptedKey(payload);
        break;
      case "key-encryption":
        result = await getEncryptedKey(payload);
        break;
    }

    self.postMessage({
      id,
      success: true,
      result,
    } satisfies CryptoWorkerResponse);
  } catch (err) {
    self.postMessage({
      id,
      success: false,
      error:
        err instanceof Error
          ? `crypto: ${err.message}`
          : "crypto: unknown error",
    } satisfies CryptoWorkerResponse);
  }
};
