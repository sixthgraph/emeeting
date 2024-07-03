import { z } from 'zod'
//import { object, minLength, string, email } from 'valibot'

export const addPositionFormSchema = z.object({
  positioncode: z.string().min(2, 'Positioncode is required').trim(),
  desc: z.string().min(1, 'Desc is required').trim()
})
