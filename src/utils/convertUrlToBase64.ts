// utils/convertUrlToBase64.ts
export const convertUrlToBase64 = async (url: string): Promise<string> => {
  // const opts = {
  //   headers: {
  //     mode: 'no-cors'
  //   }
  // }

  // const response = await fetch(url, opts)

  const headers = {}

  const response = await fetch(url, {
    method: 'GET',
    mode: 'no-cors',
    headers: headers
  })

  console.log('response')
  console.log(response)

  if (!response.ok) {
    throw new Error(`${url} HTTP error! Status: ${response.status}`)
  }

  const blob = await response.blob()

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      console.log('---blob')
      console.log(blob)

      if (reader.result) {
        resolve(reader.result as string)
      } else {
        reject(new Error('Failed to convert Blob to Base64'))
      }
    }

    reader.onerror = () => reject(new Error('Error reading Blob'))
    reader.readAsDataURL(blob)
  })
}
