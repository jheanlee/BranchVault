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

import { createBrowserRouter, RouterProvider } from "react-router";
import { paths } from "@/config/paths.ts";
import { Root } from "./routes/root.tsx";
import { NotFound } from "@/app/routes/not-found.tsx";
import { Home } from "@/app/routes/home.tsx";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.root.root.path,
      Component: Root,
      children: [
        {
          path: paths.root.home.path,
          Component: Home,
        },
        {
          path: paths.root.login.path,
          lazy: async () => {
            const { Login } = await import("@/app/routes/login.tsx");
            return { Component: Login };
          },
        },
        {
          path: paths.root.signup.path,
          lazy: async () => {
            const { Signup } = await import("@/app/routes/signup.tsx");
            return { Component: Signup };
          },
        },
        {
          path: "*",
          Component: NotFound,
        },
      ],
    },
  ]);

export const AppRouter = () => {
  const router = createAppRouter();
  return <RouterProvider router={router} />;
};
