import { z } from 'zod';

const createSettingZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error:'Name is required',
    }),
    mobile: z.string({
      required_error:'Phone is required',
    }),
    email: z.string({
      required_error:'Email is required',
    }),
    role: z.string().optional(),
    password: z.string({
      required_error:'Password is required',
    })
  }),
});


