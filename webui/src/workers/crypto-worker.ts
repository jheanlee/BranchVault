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
