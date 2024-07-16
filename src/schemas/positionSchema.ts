import { z } from 'zod'
//import { object, minLength, string, email } from 'valibot'

export const addPositionFormSchema = z.object({
  positioncode: z.string().min(2, 'Positioncode is required').trim(),
  desc: z.string().min(1, 'Desc is required').trim()
})

export const addPositionDepFormSchema = z.object({
  dep: z.string().min(1, 'dep is required').trim(),
  positioncode: z.string().min(2, 'positioncode is required').trim(),
  level: z.string().min(1, 'level is required').trim(),
  path: z.string().min(1, 'path is required').trim()
})
