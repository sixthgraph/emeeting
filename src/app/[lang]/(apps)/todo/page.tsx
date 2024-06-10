import TodoList from '@/views/apps/todo'

const getData = async () => {
  const res = await fetch(`${process.env.API_URL}/todo/list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
}

export default async function TodoListApp() {
  const data = await getData()

  return <TodoList todoData={data} />
}
