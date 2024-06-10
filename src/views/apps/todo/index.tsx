'use client'

import Grid from '@mui/material/Grid'

//import UpdateToken from '@/components/updateToken'

// Type Imports
import type { TodoType } from '@/types/apps/userTypes'

import TodoListTable from './TodoListTable'

const TodoList = ({ todoData }: { todoData?: TodoType[] }) => {
  console.log(todoData)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TodoListTable tableData={todoData} />
      </Grid>
    </Grid>
  )
}

export default TodoList
