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
