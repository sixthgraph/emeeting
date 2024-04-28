import { z } from 'zod'

export const registerFormSchema = z.object({
  firstname: z.string().min(1, 'Firstname is required').trim(),
  lastname: z.string().min(1, 'Lastname is required').trim(),
  password: z.string().min(6, 'Password is required').trim(),
  email: z.string().email('Invalid email address')
})

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})
