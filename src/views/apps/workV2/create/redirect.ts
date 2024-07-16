'use server'

import { redirect } from 'next/navigation'

export async function navigate(path: any) {
  redirect(path)

  //redirect(`/en/${data.get('id')}`)
}
