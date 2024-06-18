'use client'

// // React Imports
import { useEffect, useState, useMemo } from 'react'

// // Next Imports
// // import Link from 'next/link'
// // import { useParams } from 'next/navigation'

// // MUI Imports
// // import { NextResponse } from 'next/server'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// // Third-party Imports
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

// // Type Imports
import axios from 'axios'

// import type { Locale } from '@configs/i18n'

import TablePaginationComponent from '@components/TablePaginationComponent'

// import type { ThemeColor } from '@core/types'
import type { StateinfosType, StateinfosTypeWithAction } from '@/types/apps/stateinfoTypes'

// // Component Imports
//import TableFilters from './TableFilters'
import GroupDrawerForm from './StateinfoDrawerForm'

import CustomTextField from '@core/components/mui/TextField'
// import CustomAvatar from '@core/components/mui/Avatar'

// // Util Imports
import { getInitials } from '@/utils/getInitials'
// import { getLocalizedUrl } from '@/utils/i18n'

// // Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// // Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Search field filter for Datatable
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)
  //   // Store the itemRank info
  addMeta({
    itemRank
  })
  //   // Return if the item should be filtered in/out
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

// // Vars
let initialData = {
  statecode: '',
  desc: '',
  ref: '',
  remark: '',
  create_date: '',
  create_by: '',
  update_date: '',
  update_by: ''
}

// Column Definitions
const columnHelper = createColumnHelper<StateinfosTypeWithAction>()

type Props = {
  tableData?: StateinfosType[]
}

const StateinfoListTable = ({ tableData }: Props) => {
  // States
  const [addStateinfoOpen, setAddStateinfoOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])

  const [globalFilter, setGlobalFilter] = useState('')

  // const [updateData, setUpdateData] = useState(...[initialData])

  console.log('table data =', data)

  // Hooks
  //const { lang: locale } = useParams()

  const StateinfoDrawerOpenHandle = () => {
    initialData = {
      statecode: '',
      desc: '',
      ref: '',
      remark: '',
      create_date: '',
      create_by: '',
      update_date: '',
      update_by: ''
    }
    setAddStateinfoOpen(true)
  }

  const handleDeleteStateinfo = async (stateinfo: object) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stateinfos/delete`, stateinfo)

      if (response.data.message === 'success') {
        // console.log(response.data.data.detail)

        // //todo update tableData
        // const em: any = dep
        // const newUpdate = tableData?.filter(el => el.dep !== em.dep)

        // console.log('newUpdate === ', newUpdate)
        // setData(newUpdate)

        tableData = data

        console.log(tableData)

        //todo update refresh token
        console.log('Update token ===', response.data.token)
      } else {
        console.error('Stateinfo delete failed')
      }
    } catch (error: any) {
      console.log('Delete Stateinfo failed. ', error.message)
    }
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<StateinfosTypeWithAction, any>[]>(
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
      columnHelper.accessor('statecode', {
        header: 'Statecode',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.statecode}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('desc', {
        header: 'Desc',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.desc}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('ref', {
        header: 'Ref',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.ref}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('remark', {
        header: 'Remark',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.remark}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                handleDeleteStateinfo({ Stateinfo: row.original.statecode })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                // initialData.password = ''
                initialData.statecode = row.original.statecode
                initialData.desc = row.original.desc
                setAddStateinfoOpen(!addStateinfoOpen)
              }}
            >
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
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
    data: data as StateinfosType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter // search field
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
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
        <CardHeader title='Filters' className='pbe-4' />
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
              placeholder='Search Group'
              className='is-full sm:is-auto'
            />
            <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='is-full sm:is-auto'
            >
              Export
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => StateinfoDrawerOpenHandle()}
              className='is-full sm:is-auto'
            >
              Add New User
            </Button>
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

      {/* <GroupDrawerForm
        open={addStateinfoOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        handleClose={() => setAddStateinfoOpen(!addStateinfoOpen)}
      /> */}
    </>
  )
}
export default StateinfoListTable
