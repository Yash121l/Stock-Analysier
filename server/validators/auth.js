import { z } from 'zod';

const emailSchema = z.string().email('Invalid email format');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export const validateRegistration = (data) => {
  const schema = z.object({
    email: emailSchema,
    password: passwordSchema
  });

  return schema.safeParse(data);
};

export const validateLogin = (data) => {
  const schema = z.object({
    email: emailSchema,
    password: passwordSchema
  });

  return schema.safeParse(data);
};