//import { z } from 'zod'
import { object, minLength, string, email } from 'valibot'

export const StateinfoFormSchema = object({
  statecode: string([minLength(1, 'This field is required')]),
  desc: string([minLength(2, 'This field is required')])
})
