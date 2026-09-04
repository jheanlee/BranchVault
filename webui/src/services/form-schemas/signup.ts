import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Username must be at least 4 characters.",
    })
    .max(64, {
      message: "Username must not exceed 64 characters.",
    })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "Username should only contain letters (A-Z, a-z), numbers (0-9), underscores (_) and hyphens (-).",
    }),

  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(256, {
      message: "Password must not exceed 256 characters.",
    })
    .regex(/^[A-Za-z0-9~!@#$%^&*()_\-+={}[\]|\\:;,./]+$/, {
      message:
        "Password should only contain letters (A-Z, a-z), numbers (0-9) and symbols.",
    }),
});
