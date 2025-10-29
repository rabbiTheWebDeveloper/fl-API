import { z } from 'zod';

const createSettingZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    mobile: z.string().min(1, 'Phone is required'),
    email: z.string().min(1, 'Email is required'),
    role: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export default createSettingZodSchema;
