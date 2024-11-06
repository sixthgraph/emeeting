import { headers } from 'next/headers'

// import TodoList from '@/views/apps/todo'

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todo/list`, {
      method: 'GET',
      headers: headers()
    })

    const data = await res.json()

    return data
  } catch (err) {
    console.log(err)
  }
}

export default async function TodoListApp() {
  const data = await getData()

  console.log('todo return')
  console.log(data)

  //return <TodoList todoData={data.todo} />

  return 'todo page'
}
