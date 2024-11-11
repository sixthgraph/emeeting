'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

import { useParams } from 'next/navigation'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// import { styled } from '@mui/material/styles'
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

import { Checkbox, IconButton } from '@mui/material'

import TablePaginationComponent from '@components/TablePaginationComponent'
import type { MyAppType, MyAppTypeWithAction } from '@/types/apps/myAppTypes'

// Component Imports
// import TableFilters from './TableFilters'

// import UserDrawerForm from './UserDrawerForm'

import CustomTextField from '@core/components/mui/TextField'

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
// const Icon = styled('i')({})

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

// Column Definitions
const columnHelper = createColumnHelper<MyAppTypeWithAction>()

const MyAppListTable = (tableData: any) => {
  const data = tableData?.tableData.data
  const [globalFilter, setGlobalFilter] = useState('')
  const { lang: locale } = useParams()

  const formatshortdate = (date: any) => {
    const m_th_names = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย',
      'ธ.ค.'
    ]

    const m_en_names = ['Jan', 'Feb', 'Mar', ' Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const d = new Date(date),
      curr_date = d.getDate(),
      curr_month = d.getMonth(),
      curr_year: number = d.getFullYear() + 543

    const formattedDate = d.toLocaleString()
    const curr_time = formattedDate.split(',')[1]

    if (locale == 'th' || locale == 'en') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<MyAppTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('name', {
        header: 'App Name',
        cell: ({ row }) => (
          <div className='flex flex-col gap-2'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.name}
            </Typography>
            <Typography variant='body2'>{row.original.description}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('startdate', {
        header: 'Start',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {formatshortdate(row.original.startdate)}
          </Typography>
        )
      }),

      columnHelper.accessor('enddate', {
        header: 'End',
        cell: (
          { row } // <div className='flex flex-col pli-2 plb-3'>
        ) => (
          <Typography className='capitalize' color='text.primary'>
            {formatshortdate(row.original.enddate)}
          </Typography>
        )
      }),

      // columnHelper.accessor('color', {
      //   header: 'Color',

      //   cell: ({ row }) => (
      //     <Typography color='text.primary' className='font-medium'>
      //       {row.original.color}
      //     </Typography>
      //   )
      // }),
      columnHelper.accessor('client_alias', {
        header: 'Client',

        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.client_alias}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',

        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.status}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                console.log('click')
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            {row.original.status !== 'Active' ? (
              <Link
                href={{
                  pathname: `/${locale}/my-app/edit/${row.original._id}`
                }}
              >
                <IconButton>
                  <i className='tabler-edit text-[22px] text-textSecondary' />
                </IconButton>
              </Link>
            ) : (
              <Link
                href={{
                  pathname: `/${locale}/my-app/view/${row.original._id}`
                }}
              >
                <IconButton>
                  <i className='tabler-eye text-[22px] text-textSecondary' />
                </IconButton>
              </Link>
            )}
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Table config
  const table = useReactTable({
    data: data as MyAppType[],
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

  return (
    <>
      <Card>
        <CardHeader title='My Application' className='pbe-4' />
        {/* <TableFilters setData={setData} tableData={tableData} /> */}
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

            {/* { table.getFilteredRowModel().rows.length === 0 ? ( */}
            {tableData === null || tableData === undefined ? (
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
        {tableData && (
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
          />
        )}
      </Card>
    </>
  )
}

export default MyAppListTable
