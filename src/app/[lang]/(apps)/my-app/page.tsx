import { headers } from 'next/headers'

import MyAppList from '@/views/apps/my-app'

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-app/list`, {
      headers: headers()
    })

    const data = await res.json()

    console.log('data2')
    console.log(data)

    return data
  } catch (err) {
    console.log(err)
  }
}

const myAppPage = async () => {
  const appData: any = await getData()

  return <MyAppList data={appData} />
}

export default myAppPage
