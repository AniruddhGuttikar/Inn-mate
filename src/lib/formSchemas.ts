import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "password must be atleast 8 characters"),
  confirmPassword: z.string().min(8),
});

export const propertyFormSchema = z.object({
  name: z.string(),
});
