import axios from "axios";
import { paths } from "@/config/paths.ts";
import { Buffer } from "buffer";
import { toast } from "sonner";
import { AuthManager } from "@/store/auth.ts";

// public fetcher (login & refresh token)
export const publicFetcher = axios.create();

// cron job (automatic api calls)
export const cronFetcher = axios.create();

cronFetcher.interceptors.request.use(async (config) => {
  if (
    AuthManager.token === undefined ||
    JSON.parse(
      Buffer.from(AuthManager.token.split(".")[1], "base64").toString("ascii"),
    ).exp <
      Date.now() / 1000
  ) {
    window.location.href = paths.root.login.getHref();
    toast.error("Session expired");
    return config;
  }
  return config;
});

// private fetcher (user conducted api calls)
export const fetcher = axios.create();

fetcher.interceptors.request.use(async (config) => {
  config.headers["Authorization"] = AuthManager.token;

  if (
    AuthManager.token === undefined ||
    JSON.parse(
      Buffer.from(AuthManager.token.split(".")[1], "base64").toString("ascii"),
    ).exp <
      Date.now() / 1000 + 300
  ) {
    // const res = await refreshToken();
    // if (res !== 200) {
    window.location.href = paths.root.login.getHref();
    toast.error("Session expired");
    return config;
    // }
  }
  return config;
});
