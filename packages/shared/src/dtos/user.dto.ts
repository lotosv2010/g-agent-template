import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(100, 'name is too long'),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').max(100, 'name is too long').optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'at least one field is required',
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
