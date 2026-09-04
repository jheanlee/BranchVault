import type { passwordSchema } from "@/services/form-schemas/password-item.ts";
import { fetcher } from "@/services/fetcher.ts";
import { z } from "zod";
import { isAxiosError } from "axios";
import { AuthManager } from "@/store/auth.ts";
import { cryptoWorker } from "@/lib/crypto-worker-client-singleton.ts";

export const newPasswordItem = async (data: z.infer<typeof passwordSchema>) => {
  try {
    await fetcher.post(`/api/${AuthManager.userId ?? ""}/items/password`, {
      name: data.name,
      websites: data.websites.join(),
      username: data.username,
      email: data.email ?? "",
      encrypted_password: await cryptoWorker.run({
        type: "item-encryption",
        payload: {
          masterKey: AuthManager.masterKey ?? "",
          itemPlaintext: data.password,
        },
      }),
      notes: data.notes,
    });
    return 200;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status ?? 500;
    } else {
      return 500;
    }
  }
};

export const updatePasswordItem = async (
  data: z.infer<typeof passwordSchema>,
  item_id: number,
) => {
  try {
    await fetcher.put(
      `/api/${AuthManager.userId ?? ""}/items/password/${item_id}`,
      {
        name: data.name,
        websites: data.websites.join(),
        username: data.username,
        email: data.email,
        encrypted_password: await cryptoWorker.run({
          type: "item-encryption",
          payload: {
            masterKey: AuthManager.masterKey ?? "",
            itemPlaintext: data.password,
          },
        }),
        notes: data.notes,
      },
    );
    return 200;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status ?? 500;
    } else {
      return 500;
    }
  }
};

export const deletePasswordItem = async (item_id: number) => {
  try {
    await fetcher.delete(
      `/api/${AuthManager.userId ?? ""}/items/password/${item_id}`,
    );
    return 200;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status ?? 500;
    }
    return 500;
  }
};

export interface PasswordItem {
  name: string;
  username: string;
  email: string;
  password: string;
  website: string[];
  notes: string;
}
export const getPasswordItem = async (item_id: number) => {
  try {
    const res = await fetcher.get<{
      name: string;
      username: string;
      email: string;
      encrypted_password: string;
      website: string;
      notes: string;
    }>(`/api/${AuthManager.userId ?? ""}/items/password/${item_id}`);

    return {
      name: res.data.name,
      username: res.data.username,
      email: res.data.email,
      password: await cryptoWorker.run({
        type: "item-decryption",
        payload: {
          masterKey: AuthManager.masterKey ?? "",
          encryptedItem: res.data.encrypted_password,
        },
      }),
      websites: res.data.website.split(","),
      notes: res.data.notes,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status ?? 500;
    } else if (error instanceof Error && error.message.startsWith("crypto: ")) {
      return 1403;
    } else {
      return 500;
    }
  }
};

export interface PasswordListItem {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string[];
  notes: string;
}

export const getPasswordItems = async () => {
  try {
    const res = await fetcher.get<{
      passwords: {
        id: number;
        name: string;
        username: string;
        email: string;
        website: string;
        notes: string;
      }[];
    }>(`/api/${AuthManager.userId ?? ""}/items`);

    const passwords: {
      id: number;
      name: string;
      username: string;
      email: string;
      website: string[];
      notes: string;
    }[] = [];

    for (const item of res.data.passwords) {
      passwords.push({
        id: item.id,
        name: item.name,
        username: item.username,
        email: item.email,
        website: item.website.split(","),
        notes: item.notes,
      });
    }

    return passwords;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status ?? 500;
    } else {
      return 500;
    }
  }
};
