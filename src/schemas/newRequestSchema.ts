import { object, minLength, string } from 'valibot'

export const NewWorkSchema = object({
  // Registerdep: object({
  //   dep: string([minLength(1, 'This field is required')]),
  //   position: string([minLength(1, 'This field is required')])
  // }),
  // Registerdep: string([minLength(1, 'This field is required')]),
  Subject: string([minLength(1, 'This field is required')])
})
