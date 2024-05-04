import { z } from 'zod'

export const addUserFormSchema = z.object({
  firstname: z.string().min(1, 'Firstname is required').trim(),
  lastname: z.string().min(1, 'Lastname is required').trim(),
  password: z.string().min(8, 'Password is required').trim(),
  email: z.string().email('Invalid email address'),
  role: z.number().min(1, 'Role is required'),
  status: z.string().min(1, 'Status is required').trim()
})

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})
