import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
})

export const signUpSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
  laundryName: z.string().trim().min(1, "Ingresa el nombre de la lavandería"),
})
