//import { z } from 'zod'
import { object, minLength, string } from 'valibot'

export const stateinfoFormSchema = object({
  desc: string([minLength(1, 'This field is required')])

  // statecode: string([minLength(1, 'This field is required')]),
})
