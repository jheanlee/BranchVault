import { isAxiosError } from "axios";
import { cronFetcher, fetcher, publicFetcher } from "@/services/fetcher.ts";
import { AuthManager } from "@/store/auth.ts";

export const login = async (data: { username: string; password: string }) => {
  try {
    const res = await publicFetcher.post<{
      token: string;
      id: string;
    }>("/api/master/login", data);
    fetcher.defaults.headers["Authorization"] = res.data.token;
    cronFetcher.defaults.headers["Authorization"] = res.data.token;
    AuthManager.token = res.data.token;
    AuthManager.userId = res.data.id;
    return 200;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status || 500;
    } else {
      return 500;
    }
  }
};

export const isUsernameAvailable = async (data: { username: string }) => {
  try {
    const res = await publicFetcher.get<{
      available: boolean;
    }>("/api/master/username", {
      params: data,
    });

    return res.data.available;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status || 500;
    } else {
      return 500;
    }
  }
};

export const signup = async (data: { username: string; password: string }) => {
  try {
    await publicFetcher.post("/api/master/signup", data);
    return 200;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status || 500;
    } else {
      return 500;
    }
  }
};

export const isSignupAvailable = async () => {
  try {
    const res = await publicFetcher.get<{ signup_available: boolean }>(
      "/api/master/signup/availability",
    );
    return res.data.signup_available;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.status || 500;
    } else {
      return 500;
    }
  }
};
