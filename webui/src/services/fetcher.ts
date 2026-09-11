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
