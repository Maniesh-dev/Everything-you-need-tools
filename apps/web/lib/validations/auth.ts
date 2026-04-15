import { z } from 'zod';

// ─── Login Schema ───────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register Schema ────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
