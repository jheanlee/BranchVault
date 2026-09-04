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
