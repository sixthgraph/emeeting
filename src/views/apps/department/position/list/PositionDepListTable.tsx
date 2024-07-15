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
import type {
  PositionsDepType,
  PositionsDepTypeWithAction,
  PositionsType,
  DepType,
  PositionFilterType
} from '@/types/apps/positionTypes'

// // Component Imports
//import TableFilters from './TableFilters'
import GroupDrawerForm from './PositionDepDrawerForm'

import CustomTextField from '@core/components/mui/TextField'
// import CustomAvatar from '@core/components/mui/Avatar'

// // Util Imports
import { getInitials } from '@/utils/getInitials'
// import { getLocalizedUrl } from '@/utils/i18n'

// // Style Imports
import tableStyles from '@core/styles/table.module.css'
import { integer } from 'valibot'
import { useSearchParams } from 'next/navigation'

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

const posObj: PositionFilterType = {}
const depObj: DepType = {}

// // Vars
let initialData = {
  dep: '',
  depname: '',
  path: '',
  sort: '',
  ref: '',
  positioncode: '',
  positiondesc: '',
  positionpath: '',
  positionlevel: '',
  positionref: ''
}

// Column Definitions
const columnHelper = createColumnHelper<PositionsDepTypeWithAction>()

type Props = {
  tableData?: PositionsDepType[]
  positionData?: PositionFilterType[]
  depData?: DepType[]
}

const PositionDepListTable = ({ tableData, positionData, depData }: Props) => {
  const searchParams = useSearchParams()

  const dep = searchParams.get('dep')

  // console.log('tableData 222222')
  console.log(dep)
  //console.log(tableData)
  positionData?.map(position => {
    const id = String(position.positioncode)

    posObj[id] = {
      positioncode: String(position.positioncode),
      desc: String(position.desc),
      level: String(position.level),
      ref: String(position.ref),
      status: String(position.status),
      remark: String(position.remark)
    }
  })
  //console.log('positionData === ', positionData)
  depData?.map(department => {
    const id = String(department.dep)

    depObj[id] = {
      dep: String(department.Dep),
      depname: String(department.Depname),
      docuname: Number(department.Docuname),
      path: String(department.Path),
      sort: Number(department.Sort)
    }
  })

  // States
  const [addPositionDepOpen, setAddPositionDepOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])

  const [globalFilter, setGlobalFilter] = useState('')

  // const [updateData, setUpdateData] = useState(...[initialData])

  //console.log('table data =', data)
  //console.log('position data =', data)

  // Hooks
  //const { lang: locale } = useParams()

  const PositionDepDrawerOpenHandle = () => {
    initialData = {
      dep: '',
      depname: '',
      path: '',
      sort: '',
      ref: '',
      positioncode: '',
      positiondesc: '',
      positionpath: '',
      positionlevel: '',
      positionref: ''
    }
    setAddPositionDepOpen(true)
  }

  const handleDeletePositionDep = async (dep: object, positioncode: object) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/delete`, dep, positioncode)

      if (response.data.message === 'success') {
        console.log('=====positioninfo')
        console.log(response.data)

        // //todo update tableData
        const em: any = positioncode
        console.log('==== look positioncode')
        console.log(positioncode)

        const newUpdate = tableData?.filter(el => el.positioncode !== em.positioncode)

        console.log('newUpdate === ', newUpdate)
        setData(newUpdate)

        tableData = data

        console.log(tableData)

        //todo update refresh token
        console.log('Update token ===', response.data.token)
        handleRefresh()
      } else {
        console.error('Position delete failed')
      }
    } catch (error: any) {
      console.log('Delete Position failed. ', error.message)
    }
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<PositionsDepTypeWithAction, any>[]>(
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
      // columnHelper.accessor('dep', {
      //   header: 'Dep',
      //   cell: ({ row }) => (
      //     <div className='flex flex-col'>
      //       <Typography color='text.primary' className='font-medium'>
      //         {row.original.dep}
      //       </Typography>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('depname', {
        header: 'Depname',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.depname}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('path', {
        header: 'Path',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.path}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('positioncode', {
        header: 'Positioncode',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.positioncode}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('positiondesc', {
        header: 'Positiondesc',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.positiondesc}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('positionpath', {
        header: 'Positionpath',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.positionpath}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('positionlevel', {
        header: 'Positionlevel',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.positionlevel}
            </Typography>
          </div>
        )
      }),
      // columnHelper.accessor('positionref', {
      //   header: 'Positionref',
      //   cell: ({ row }) => (
      //     <div className='flex flex-col'>
      //       <Typography color='text.primary' className='font-medium'>
      //         {row.original.positionref}
      //       </Typography>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                handleDeletePositionDep({ dep: row.original.dep }, { positioncode: row.original.positioncode })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                initialData.dep = row.original.dep
                initialData.depname = row.original.depname
                initialData.path = row.original.path
                initialData.sort = row.original.sort
                initialData.ref = row.original.ref
                initialData.positioncode = row.original.positioncode
                initialData.positiondesc = row.original.positiondesc
                initialData.positionlevel = row.original.positionlevel
                initialData.positionpath = row.original.positionpath
                initialData.positionref = row.original.positionref

                setAddPositionDepOpen(!addPositionDepOpen)
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
    data: data as PositionsDepType[],
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
              onClick={() => PositionDepDrawerOpenHandle()}
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
            {/* {table.getFilteredRowModel().rows.length === 0 ? ( */}
            {tableData?.length == 0 ? (
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

      <GroupDrawerForm
        open={addPositionDepOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        depData={depData}
        positionData={positionData}
        handleClose={() => setAddPositionDepOpen(!addPositionDepOpen)}
      />
    </>
  )
}
export default PositionDepListTable