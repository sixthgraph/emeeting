import { headers } from 'next/headers'

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/list`, {
      headers: headers()
    })

    const data = await res.json()

    console.log('page return data comment list')
    console.log(data)

    return data
  } catch (err) {
    console.log(err)
  }
}

// const commentsPage = async () => {
//   return <h1>Comments</h1>
// }

//export default commentsPage

export default async function commentsPage() {
  const data = await getData()

  //return <TodoList todoData={data.todo} />

  return (
    <>
      <h1>Comments</h1>
      <br></br>
      {JSON.stringify(data.commentdata)}
    </>
  )
}
