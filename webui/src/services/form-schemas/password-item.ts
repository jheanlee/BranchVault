import { z } from "zod";

export const passwordSchema = z.object({
  name: z.string().normalize().min(1).max(256),
  email: z.email().or(z.literal("")),
  username: z.string().normalize().max(1024),
  password: z.string().normalize().max(1024),
  websites: z.array(z.string().normalize().max(2048)).max(256),
  notes: z.string().normalize().max(2048),
});
