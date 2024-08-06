import { z } from 'zod'

//import { object, minLength, string, email } from 'valibot'

export const addDepartmentFormSchema = z.object({
  depname: z.string().min(1, 'Depname is required').trim()
})
