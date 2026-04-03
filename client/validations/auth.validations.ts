import { z } from "zod";


export const registerUserSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Minimum 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/, "Password must contain at least one lowercase letter and one uppercase letter"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

export const loginUserSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
})