// import { z } from 'zod'
import { object, minLength, string } from 'valibot'

export const addDepartmentFormSchema = object({
  depname: string([minLength(1, 'This field is required')])

  // insertmany: array(string([minLength(1, 'This field is required')]), [minLength(1, 'At least one item is required')])
})
