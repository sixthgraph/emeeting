import { z } from 'zod'
import { object, minLength, string, email } from 'valibot'

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

export const RegisterSchema = object({
  firstname: string([minLength(1, 'This field is required')]),
  lastname: string([minLength(1, 'This field is required')]),
  email: string([minLength(1, 'This field is required'), email('Email is invalid')]),
  password: string([
    minLength(1, 'This field is required'),
    minLength(8, 'Password must be at least 8 characters long')
  ])
})
