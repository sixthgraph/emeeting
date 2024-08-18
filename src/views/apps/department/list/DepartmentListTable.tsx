'use client'

// // React Imports
import { useEffect, useState, useMemo } from 'react'

// // Next Imports
// // import Link from 'next/link'
// // import { useParams } from 'next/navigation'

// // MUI Imports
// // import { NextResponse } from 'next/server'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
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
import type { DepartmentsType, DepartmentsTypeWithAction, StateinfoType } from '@/types/apps/departmentTypes'

// // Component Imports
import TableFilters from './TableFilters'
import DepartmentDrawerForm from './DepartmentDrawerForm'

import CustomTextField from '@core/components/mui/TextField'

// import CustomAvatar from '@core/components/mui/Avatar'

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

const handleRefresh = () => {
  //router.reload()
  setTimeout(() => {
    window.location.reload()
  }, 100)
}

// // Styled Components
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

const stateinfoObj: StateinfoType = {}

let initialData = {
  dep: '',
  depname: '',
  statecode: '',
  docuname: 0,
  path: '',
  parent: '',
  sort: 0,
  ref: ''
}

// Column Definitions
const columnHelper = createColumnHelper<DepartmentsTypeWithAction>()

type Props = {
  tableData?: DepartmentsType[]
  stateinfoData?: StateinfoType[]
}

const DepartmentListTable = ({ tableData, stateinfoData }: Props) => {
  // States
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])

  const [globalFilter, setGlobalFilter] = useState('')

  stateinfoData?.map(stateinfo => {
    const id = String(stateinfo.statecode)

    stateinfoObj[id] = {
      statecode: String(stateinfo.statecode),
      desc: String(stateinfo.desc)
    }
  })

  const DepartmentDrawerOpenHandle = () => {
    initialData = {
      dep: '',
      depname: '',
      statecode: '01',
      docuname: 0,
      path: '',
      parent: '',
      sort: 0,
      ref: ''
    }
    setAddDepartmentOpen(true)
  }

  const handleDeleteDepartment = async (dep: object, path: any) => {
    try {
      if (path != ',') {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/delete`, dep)

        if (response.data.message === 'success') {
          console.log(response.data.data.detail)

          //todo update tableData
          const em: any = dep
          const newUpdate = tableData?.filter(el => el.dep !== em.dep)

          console.log('newUpdate === ', newUpdate)
          setData(newUpdate)
          tableData = data
          console.log(tableData)

          //todo update refresh token
          console.log('Update token ===', response.data.token)

          handleRefresh()
        } else {
          console.error('Department delete failed')
        }
      } else {
        console.error('Can not delete root department')
      }
    } catch (error: any) {
      console.log('Delete Department failed. ', error.message)
    }
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<DepartmentsTypeWithAction, any>[]>(
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
      columnHelper.accessor('depname', {
        header: 'Department Name',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.path.split(',').length <= 2
                ? row.original.depname
                : '='.repeat(row.original.path.split(',').length - 1) + ' ' + row.original.depname}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('statecode', {
        header: 'Statedesc',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {stateinfoObj[row.original.statecode] && stateinfoObj[row.original.statecode].desc}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('docuname', {
        header: 'Docuname',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.docuname}
            </Typography>
            {/* {row.original.member.map(member => (
              <Typography color='text.primary' className='font-medium'>
                {member}
              </Typography>
            ))} */}
          </div>
        )
      }),
      columnHelper.accessor('sort', {
        header: 'Sort',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.sort}
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
                handleDeleteDepartment({ Dep: row.original.dep }, row.original.path)
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                // initialData.password = ''
                initialData.dep = row.original.dep
                initialData.depname = row.original.depname
                initialData.docuname = row.original.docuname
                initialData.statecode = row.original.statecode
                initialData.parent = row.original.parent
                initialData.path = row.original.path
                initialData.sort = row.original.sort
                setAddDepartmentOpen(!addDepartmentOpen)
              }}
            >
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <Link
              href={{
                pathname: '/en/position/dep',
                query: `dep=${row.original.dep}`
              }}
            >
              <IconButton>
                <i className='tabler-shield text-[22px] text-textSecondary' />
              </IconButton>
            </Link>
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
    data: data as DepartmentsType[],
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
        <CardHeader title='Departments' className='pbe-4' />
        <TableFilters setData={setData} tableData={tableData} depData={tableData} />
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
              onClick={() => DepartmentDrawerOpenHandle()}
              className='is-full sm:is-auto'
            >
              Add New
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

      <DepartmentDrawerForm
        open={addDepartmentOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        stateinfoData={stateinfoData}
        handleClose={() => setAddDepartmentOpen(!addDepartmentOpen)}
      />
    </>
  )
}

export default DepartmentListTable
