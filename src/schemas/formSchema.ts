import { z } from 'zod'
import { object, minLength, string, email } from 'valibot'

export const addUserFormSchema = object({
  firstname: string([minLength(1, 'This field is required')]),
  lastname: string([minLength(1, 'This field is required')]),
  password: string([minLength(8, 'This field is required')]),
  email: string([minLength(1, 'This field is required')]),

  // role: number([minLength(1, 'This field is required')]),
  status: string([minLength(1, 'This field is required')])

  // insertmany: string([minLength(1, 'This field is required')])

  // insertmany: array(string([minLength(1, 'This field is required')]), [minLength(1, 'At least one item is required')])
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

export const addGroupFormSchema = object({
  groupname: string([minLength(3, 'This field is required')])

  //member: string([minLength(3, 'This field is required')])
  // member: array(string([minLength(3, 'This field is required')]))
})
