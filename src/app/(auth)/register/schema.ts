import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(3, 'Ingresa al menos 3 caracteres.')
      .max(60, 'Mantén este campo corto.'),
    lastName: z
      .string()
      .trim()
      .min(3, 'Ingresa al menos 3 caracteres.')
      .max(60, 'Mantén este campo corto.'),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9]+$/, 'El teléfono solo puede contener números.')
      .min(10, 'El teléfono debe tener al menos 10 caracteres.')
      .max(15, 'El teléfono no puede tener más de 15 caracteres.'),
    email: z.string().email('Ingresa un correo válido.'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Incluye al menos una letra mayúscula.')
      .regex(/[0-9]/, 'Incluye al menos un número.'),
    confirmPassword: z.string(),
    lavanderia: z.string().min(3, 'El nombre de la lavandería debe tener al menos 3 caracteres.'),
    acceptTerms: z
      .boolean()
      .refine((value) => value, { message: 'Debes aceptar los términos y condiciones.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export type RegisterInput = z.infer<typeof registerSchema>;

