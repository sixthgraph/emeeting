'use client'

import Grid from '@mui/material/Grid'

// Type Imports
import type { TodoType } from '@/types/apps/todoTypes'

import TodoListTable from './TodoListTable'

const TodoList = ({ todoData }: { todoData?: TodoType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TodoListTable tableData={todoData} />
      </Grid>
    </Grid>
  )
}

export default TodoList
