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

import type {
  CryptoWorkerRequest,
  CryptoWorkerResponse,
} from "@/workers/crypto-worker.ts";

export class CryptoWorkerClient {
  private worker: Worker;
  private pending = new Map<
    string,
    {
      resolve: (value: string) => void;
      reject: (reason: Error) => void;
    }
  >();

  constructor() {
    this.worker = new Worker(
      new URL("../workers/crypto-worker.ts", import.meta.url),
      { type: "module" },
    );

    this.worker.onmessage = (event: MessageEvent<CryptoWorkerResponse>) => {
      const data = event.data;
      const entry = this.pending.get(data.id);

      if (!entry) return;

      this.pending.delete(data.id);

      if (data.success) {
        entry.resolve(data.result);
      } else {
        entry.reject(new Error(data.error));
      }
    };
  }

  run(task: Omit<CryptoWorkerRequest, "id">): Promise<string> {
    const id = crypto.randomUUID().toString();

    return new Promise<string>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });

      this.worker.postMessage({
        id,
        ...task,
      } as CryptoWorkerRequest);
    });
  }

  terminate() {
    this.worker.terminate();
  }
}
