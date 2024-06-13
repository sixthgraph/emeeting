'use client'

import Grid from '@mui/material/Grid'

// Type Imports
import type { TodoType } from '@/types/apps/todoTypes'
import type { DepType } from '@/types/apps/userTypes'

import TodoListTable from './TodoListTable'

const TodoList = ({ todoData, depData }: { todoData?: TodoType[]; depData?: DepType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TodoListTable tableData={todoData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default TodoList
