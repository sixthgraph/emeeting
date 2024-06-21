import { z } from 'zod'
//import { object, minLength, string, email } from 'valibot'

export const addStateinfoFormSchema = z.object({
  statecode: z.string().min(2, 'Statecode is required').trim(),
  desc: z.string().min(1, 'Desc is required').trim()
})
