import { z } from 'zod'

import { object, minLength, string } from 'valibot'

export const addPositionFormSchema = object({
  // positioncode: string([minLength(1, 'This field is required')]),
  desc: string([minLength(1, 'This field is required')])
})

export const addPositionDepFormSchema = z.object({
  dep: z.string().min(1, 'dep is required').trim(),
  positioncode: z.string().min(2, 'positioncode is required').trim(),
  level: z.string().min(1, 'level is required').trim(),
  path: z.string().min(1, 'path is required').trim()
})
