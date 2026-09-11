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

import { cryptoWorker } from "@/lib/crypto-worker-client-singleton.ts";
import { AuthManager } from "@/store/auth.ts";
import { localStorageKeys } from "@/config/local-storage.ts";
import { validateKey } from "@/lib/key.ts";

interface GetMasterKeyProps {
  masterPassword: string;
}
export const getMasterKey = async ({ masterPassword }: GetMasterKeyProps) => {
  const encryptedKey = localStorage.getItem(localStorageKeys.masterKey);
  const username = localStorage.getItem(localStorageKeys.username);
  if (encryptedKey === null || username === null) return 404;

  AuthManager.masterKey = await cryptoWorker
    .run({
      type: "key-decryption",
      payload: {
        masterPassword: masterPassword,
        key: encryptedKey,
      },
    })
    .catch(() => undefined);

  if (
    AuthManager.masterKey !== undefined &&
    !validateKey(AuthManager.masterKey)
  ) {
    AuthManager.masterKey = undefined;
  }

  return AuthManager.masterKey !== undefined ? 200 : 403;
};

interface SetMasterKeyProps {
  masterPassword: string;
  masterKey: string;
  username: string;
}
export const setMasterKey = async ({
  masterPassword,
  masterKey,
  username,
}: SetMasterKeyProps) => {
  const encryptedKey = await cryptoWorker.run({
    type: "key-encryption",
    payload: {
      masterPassword: masterPassword,
      key: masterKey,
    },
  });

  localStorage.setItem(localStorageKeys.masterKey, encryptedKey);
  localStorage.setItem(localStorageKeys.username, username);

  return 200;
};
