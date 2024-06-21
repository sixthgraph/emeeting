'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
// import Link from 'next/link'
// import { useParams } from 'next/navigation'

// MUI Imports
// import { NextResponse } from 'next/server'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import Chip from '@mui/material/Chip'

//import Checkbox from '@mui/material/Checkbox'

import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
//import axios from 'axios'

//import type { Locale } from '@configs/i18n'

import TablePaginationComponent from '@components/TablePaginationComponent'

// import type { ThemeColor } from '@core/types'
import type { TodoType, TodoTypeWithAction } from '@/types/apps/todoTypes'
import type { DepType } from '@/types/apps/userTypes'

// Component Imports
import TableFilters from './TableFilters'

// import UserDrawerForm from './UserDrawerForm'

import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

//import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Search field filter for Datatable
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const depObj: DepType = {}

// Vars

// Column Definitions
const columnHelper = createColumnHelper<TodoTypeWithAction>()

type Props = {
  tableData?: TodoType[]
  depData?: DepType[]
}

const TodoListTable = ({ tableData, depData }: Props) => {
  depData?.map(dep => {
    const id = String(dep.dep)

    depObj[id] = {
      dep: String(dep.dep),
      depname: String(dep.depname),
      docuname: Number(dep.docuname),
      path: String(dep.path),
      sort: Number(dep.sort),
      statecode: String(dep.statecode)
    }
  })

  console.log('depObj==')
  console.log(depObj)

  // States
  //const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

  console.log('todo list table load.')

  const handleRowClick = () => {
    alert('click')
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<TodoTypeWithAction, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },

      // columnHelper.accessor('readed', {
      //   header: '',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-4'>
      //       <div className='flex flex-col'>
      //         {row.original.readed ? (
      //           <Icon className='text-[22px] text-textSecondary tabler-mail-opened' />
      //         ) : (
      //           <Icon className='text-[22px] text-textSecondary tabler-mail' />
      //         )}
      //       </div>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('processname', {
        header: '',
        cell: ({}) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Icon className='text-[22px] text-textSecondary tabler-mail' />
            </div>
          </div>
        )
      }),
      columnHelper.accessor('registeruid', {
        header: 'Created By',
        cell: ({ row }) => (
          <div
            className='flex items-center gap-4'
            onClick={() => {
              handleRowClick()
            }}
          >
            {getAvatar({ avatar: row.original.avatar, fullName: row.original.firstname + ' ' + row.original.lastname })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.firstname + ' ' + row.original.lastname}
              </Typography>
              <Typography variant='body2'>{row.original.registeruid}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('subject', {
        header: 'Subject',
        cell: (
          { row } // <div className='flex flex-col pli-2 plb-3'>
        ) => (
          <div
            className='flex flex-col pli-2 plb-3'
            onClick={() => {
              handleRowClick()
            }}
          >
            <Typography color='text.primary' className='font-medium'>
              {row.original.subject}
            </Typography>
            <div className='flex'>
              {row.original.overdue ? (
                <Chip variant='tonal' sx={{ marginRight: 2 }} size='small' label='overdue' color='error' />
              ) : (
                ''
              )}
              {row.original.status && <Chip variant='tonal' size='small' label={row.original.status} color='warning' />}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('basketid', {
        header: 'Department',
        cell: ({ row }) => (
          <div
            className='flex items-center gap-2'
            onClick={() => {
              handleRowClick()
            }}
          >
            <Typography color='text.primary' className='font-medium'>
              {depObj[row.original.basketid] && depObj[row.original.basketid].depname}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('Registerdate', {
        header: 'Created',
        cell: ({ row }) => (
          <div
            className='flex items-center gap-2'
            onClick={() => {
              handleRowClick()
            }}
          >
            <Typography className='capitalize' color='text.primary'>
              {row.original.Registerdate}
            </Typography>
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Table config
  const table = useReactTable({
    data: data as TodoType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter // search field
    },
    state: {
      //rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },

    //enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,

    //onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = (params: Pick<TodoType, 'avatar' | 'fullName'>) => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName as string)}</CustomAvatar>
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <TableFilters depData={depData} setData={setData} tableData={tableData} />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Todo'
              className='is-full sm:is-auto'
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default TodoListTable