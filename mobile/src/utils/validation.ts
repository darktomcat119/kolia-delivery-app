import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('auth.errors.invalidEmail'),
  password: z.string().min(6, 'auth.errors.passwordMin'),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(1, 'auth.errors.nameRequired'),
    email: z.string().email('auth.errors.invalidEmail'),
    password: z.string().min(6, 'auth.errors.passwordMin'),
    confirmPassword: z.string().min(6, 'auth.errors.passwordMin'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('auth.errors.invalidEmail'),
});

export const profileSchema = z.object({
  fullName: z.string().min(1, 'auth.errors.nameRequired'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
