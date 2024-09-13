'use client'

// // React Imports
import type { MouseEvent } from 'react'
import { useEffect, useState, useMemo } from 'react'

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

// Style Imports
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

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
import type { ColumnDef, FilterFn, RowSelectionState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import axios from 'axios'

import { ListItemIcon, ListItemText, Menu } from '@mui/material'

import { useSession } from 'next-auth/react'

import TablePaginationComponent from '@components/TablePaginationComponent'

// import type { ThemeColor } from '@core/types'
import type { DepartmentsType, DepartmentsTypeWithAction, StateinfoType } from '@/types/apps/departmentTypes'

// // Component Imports
import TableFilters from './TableFilters'
import DepartmentDrawerForm from './DepartmentDrawerForm'
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
  const [openMode, setOpenMode] = useState<any>('') // insert-one || update-one || insert-many || update-many
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectRowCount, setSelectRowCount] = useState<any>(0)
  const [updateDatas, setUpdateDatas] = useState<any[]>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [confirm, setConfirm] = useState<boolean>(false)
  const [deleteDep, setDeleteDep] = useState<any>({})
  const handleCloseConfirm = () => setConfirm(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOptMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleOptMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const rowData: any[] = []
    const data = table.getSelectedRowModel().rows //sg here

    for (const row of data) {
      rowData.push(row.original)
    }

    setSelectRowCount(data.length)

    setUpdateDatas(rowData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  const { data: session } = useSession()
  const token = session?.user.token

  stateinfoData?.map(stateinfo => {
    const id = String(stateinfo.statecode)

    stateinfoObj[id] = {
      statecode: String(stateinfo.statecode),
      desc: String(stateinfo.desc)
    }
  })

  const DepartmentDrawerOpenHandle = (mode: any) => {
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
    setOpenMode(mode)
    setAddDepartmentOpen(true)
    setAnchorEl(null)
  }

  const updateDepartmentList = async () => {
    console.log('updateDepartmentList start')
    setRowSelection({})
    console.log('rowSelection')
    console.log(rowSelection)

    try {
      const reqBody = { token: session?.user.token }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/list`, reqBody, { headers })

      console.log('response.data')
      console.log(response.data)

      setData(response.data.data.detail)
    } catch (err) {
      console.log(err)
    }

    //}
  }

  const handleDeleteDepartment = async () => {
    const reqBody: any = deleteDep
    const dep: object = { Dep: reqBody.Dep }

    try {
      if (reqBody.path != ',') {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/delete`, dep)

        if (response.data.message === 'success') {
          console.log(response.data.data.detail)
          handleCloseConfirm()
          updateDepartmentList()
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

  const handleDeleteDepartments = async () => {
    const reqBody: any = updateDatas

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/deleteMany`, reqBody)

      if (response.data.message === 'success') {
        updateDepartmentList()
        handleCloseConfirm()
      } else {
        console.error('Delete department failed.')
      }
    } catch (error: any) {
      console.log('Delete department failed. ', error.message)
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
        ),
        enableSorting: false
      }),
      columnHelper.accessor('statecode', {
        header: 'State Code',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {stateinfoObj[row.original.statecode] && stateinfoObj[row.original.statecode].desc}
            </Typography>
          </div>
        ),
        enableSorting: false
      }),

      // columnHelper.accessor('docuname', {
      //   header: 'Docuname',
      //   cell: ({ row }) => (
      //     <div className='flex flex-col'>
      //       <Typography color='text.primary' className='font-medium'>
      //         {row.original.docuname}
      //       </Typography>
      //     </div>
      //   ),
      //   enableSorting: false
      // }),
      // columnHelper.accessor('sort', {
      //   header: 'Sort',
      //   cell: ({ row }) => (
      //     <div className='flex flex-col'>
      //       <Typography color='text.primary' className='font-medium'>
      //         {row.original.sort}
      //       </Typography>
      //     </div>
      //   ),
      //   enableSorting: false
      // }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setConfirm(true)
                setOpenMode('delete-one')
                setDeleteDep({ Dep: row.original.dep, path: row.original.path, depname: row.original.depname })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>

            <IconButton
              onClick={() => {
                initialData.dep = row.original.dep
                initialData.depname = row.original.depname
                initialData.docuname = row.original.docuname
                initialData.statecode = row.original.statecode
                initialData.parent = row.original.parent
                initialData.path = row.original.path
                initialData.sort = row.original.sort
                setAddDepartmentOpen(true)
                setOpenMode('update-one')
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
              placeholder='Search Department Name'
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => DepartmentDrawerOpenHandle('insert-one')}
              className='is-full sm:is-auto'
            >
              Add New
            </Button>

            <Button
              variant='outlined'
              aria-haspopup='true'
              onClick={handleOptMenuClick}
              className='px-0 min-w-10'
              aria-controls='customized-menu'
            >
              <i className='tabler-dots-vertical' />
            </Button>
            {selectRowCount > 0 ? (
              <Menu
                keepMounted
                elevation={0}
                anchorEl={anchorEl}
                id='customized-menu'
                onClose={handleOptMenuClose}
                open={Boolean(anchorEl)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
              >
                <MenuItem onClick={() => DepartmentDrawerOpenHandle('insert-many')}>
                  <ListItemIcon>
                    <i className='tabler-plus text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Add Multiple' />
                </MenuItem>
                <MenuItem onClick={() => DepartmentDrawerOpenHandle('update-many')}>
                  <ListItemIcon>
                    <i className='tabler-pencil text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Edit Selected' />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setOpenMode('delete-many')
                    setConfirm(true) // sg here
                    setAnchorEl(null)
                  }}
                >
                  <ListItemIcon>
                    <i className='tabler-trash text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Delete Selected' />
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                keepMounted
                elevation={0}
                anchorEl={anchorEl}
                id='customized-menu'
                onClose={handleOptMenuClose}
                open={Boolean(anchorEl)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
              >
                <MenuItem onClick={() => DepartmentDrawerOpenHandle('insert-many')}>
                  <ListItemIcon>
                    <i className='tabler-plus text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Add Multiple' />
                </MenuItem>
                <MenuItem disabled>
                  <ListItemIcon>
                    <i className='tabler-pencil text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Edit Selected' />
                </MenuItem>
                <MenuItem disabled>
                  <ListItemIcon>
                    <i className='tabler-trash text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Delete Selected' />
                </MenuItem>
              </Menu>
            )}
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
                        //width: header.getSize() !== 150 ? header.getSize() : undefined
                        //width: header.index === 0 ? 60 : 'auto'
                        width:
                          header.index === 0
                            ? 60
                            : 'auto' && header.index === 2
                              ? 180
                              : 'auto' && header.index === 3
                                ? 180
                                : 'auto'
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
              Do you want to delete <span className='text-primary'>{deleteDep.depname}</span> ?
            </DialogContentText>
          )}
          {openMode == 'delete-many' && (
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
          )}
        </DialogContent>
        <DialogActions className='justify-center pbs-5 sm:pbe-10 sm:pli-16'>
          <Button variant='tonal' color='error' onClick={handleCloseConfirm}>
            Cancal
          </Button>
          {openMode == 'delete-one' && (
            <Button color='error' variant='contained' onClick={handleDeleteDepartment}>
              Yes, delete it?
            </Button>
          )}
          {openMode == 'delete-many' && (
            <Button color='error' variant='contained' onClick={handleDeleteDepartments}>
              Yes, delete it?
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <DepartmentDrawerForm
        open={addDepartmentOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        stateinfoData={stateinfoData}
        rowData={updateDatas}
        handleClose={() => setAddDepartmentOpen(!addDepartmentOpen)}
        mode={openMode}
        updateDepartmentList={updateDepartmentList}
      />
    </>
  )
}

export default DepartmentListTable
