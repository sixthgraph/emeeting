'use client'

import { useEffect, useState, useMemo } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

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
import axios from 'axios'

import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

import { useSession } from 'next-auth/react'

import TablePaginationComponent from '@components/TablePaginationComponent'
import type {
  PositionsDepType,
  PositionsDepTypeWithAction,
  DepType,
  PositionFilterType
} from '@/types/apps/positionTypes'

import PositionDepDrawerForm from './PositionDepDrawerForm'
import CustomTextField from '@core/components/mui/TextField'

import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

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
  positionref: '',
  positionparent: '',
  depparent: ''
}

// Column Definitions
const columnHelper = createColumnHelper<PositionsDepTypeWithAction>()

type Props = {
  tableData?: PositionsDepType[]
  positionData?: PositionFilterType[]
  depData?: DepType[]
  depId?: any[]
}

const PositionDepListTable = ({ tableData, positionData, depData, depId }: Props) => {
  console.log('tableData')
  console.log(tableData)
  console.log('depData')
  console.log(depData)
  console.log('dep')
  console.log(depId)

  const router = useRouter()
  let depName = ''

  {
    tableData && tableData[Number(0)] && (depName = tableData[Number(0)].depname)
  }

  // States
  const [addPositionDepOpen, setAddPositionDepOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [openMode, setOpenMode] = useState<any>('') // insert-one || update-one || insert-many || update-many
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [confirm, setConfirm] = useState<boolean>(false)
  const [deletePos, setDeletePos] = useState<any>({})

  const { data: session } = useSession()
  const token = session?.user.token

  const searchParams = useSearchParams()
  let depID = searchParams.get('dep')

  if (depID == null) {
    depID = ''
  }

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

  const PositionDepDrawerOpenHandle = () => {
    let level = '0'
    let deppath = ''

    if (tableData?.length) {
      level = ''

      const index = tableData?.findIndex(x => x.dep == String(depID))

      deppath = tableData[Number(index)].path
    }

    initialData = {
      dep: String(depID),
      depname: '',
      path: String(deppath),
      sort: '',
      ref: '',
      positioncode: '',
      positiondesc: '',
      positionpath: '',
      positionlevel: String(level),
      positionref: '',
      positionparent: '',
      depparent: String(depID)
    }
    setAddPositionDepOpen(true)
  }

  const handleCloseConfirm = () => setConfirm(false)

  const updateDepPositionList = async () => {
    console.log('updateDepPositionList start')

    try {
      const reqBody = {
        dep: depId,
        token: token
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/positions/list`, reqBody, {
        headers
      })

      setData(response.data.data.detail)
    } catch (err) {
      console.log('error')
    }
  }

  const handleDeletePositionDep = async () => {
    setConfirm(false)

    const positionDepData = {
      dep: deletePos.dep,
      positioncode: deletePos.positioncode
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/departments/positions/delete`,
        positionDepData
      )

      if (response.data.message === 'success') {
        updateDepPositionList()
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
        header: 'Position Name',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {/* {row.original.positiondesc} */}
              {row.original.path.split(',').length <= 2
                ? row.original.positiondesc
                : '='.repeat(row.original.positionpath.split(',').length - 1) + ' ' + row.original.positiondesc}
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
                setConfirm(true)
                setOpenMode('delete-one')
                setDeletePos({
                  dep: row.original.dep,
                  positioncode: row.original.positioncode,
                  positiondesc: row.original.positiondesc
                })
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

                const parentpath = row.original.positionpath.split(',')
                let parent = ''

                parent = parentpath[parentpath.length - 2]
                initialData.positionparent = parent

                const deppath = row.original.path.split(',')
                let depparent = ''

                depparent = deppath[deppath.length - 2]
                initialData.depparent = depparent

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
        <CardHeader
          action={
            <Chip
              label='Back'
              size='small'
              variant='outlined'
              className='text-xs'
              icon={<i className='tabler-arrow-badge-left' />}
              onClick={() => router.push(`/en/departments`)}
            />
          }
          title={`Position list of ${depName}`}
          className='pbe-4'
        />
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
              placeholder='Search Position'
              className='is-full sm:is-auto'
            />
            {/* <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='is-full sm:is-auto'
            >
              Export
            </Button> */}
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
                    <th
                      key={header.id}
                      style={{
                        width: header.index === 3 ? 180 : 'auto'
                      }}
                    >
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

      <Dialog
        open={confirm}
        onClose={handleCloseConfirm}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle className='text-center pb-0' id='alert-dialog-title'>
          <i className='tabler-alert-circle mbe-2 text-[96px] text-error' />
          <br />
          Are you sure?
        </DialogTitle>
        <DialogContent>
          {openMode == 'delete-one' && (
            <DialogContentText className='text-center' id='alert-dialog-description'>
              Do you want to delete <span className='text-primary'>{deletePos.positiondesc}</span> ?
            </DialogContentText>
          )}
          {/* {openMode == 'delete-many' && (
            <DialogContentText className='text-center' id='alert-dialog-description'>
              Do you want to delete ?
              {openMode == 'delete-many' &&
                updateDatas?.map((elem: any, index: any) => {
                  return (
                    <Typography color='primary' key={index}>
                      {elem.depname}
                    </Typography>
                  )
                })}
            </DialogContentText>
          )} */}
        </DialogContent>
        <DialogActions className='justify-center pbs-5 sm:pbe-10 sm:pli-16'>
          <Button variant='tonal' color='error' onClick={handleCloseConfirm}>
            Cancal
          </Button>
          {openMode == 'delete-one' && (
            <Button color='error' variant='contained' onClick={handleDeletePositionDep}>
              Yes, delete it?
            </Button>
          )}
          {openMode == 'delete-many' && (
            <Button color='error' variant='contained' onClick={handleDeletePositionDep}>
              Yes, delete it?
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <PositionDepDrawerForm
        open={addPositionDepOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        positionData={positionData}
        handleClose={() => setAddPositionDepOpen(!addPositionDepOpen)}
        updateDepPositionList={updateDepPositionList}
      />
    </>
  )
}

export default PositionDepListTable
