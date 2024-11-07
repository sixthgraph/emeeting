'use client'

// React Imports
import type { MouseEvent } from 'react'
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
import { ListItemIcon, ListItemText, Menu } from '@mui/material'

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
import type { ColumnDef, FilterFn, RowSelectionState } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// // Type Imports
import axios from 'axios'

// import type { Locale } from '@configs/i18n'

import { useSession } from 'next-auth/react'

import TablePaginationComponent from '@components/TablePaginationComponent'

// import type { ThemeColor } from '@core/types'
import type { PositionsType, PositionsTypeWithAction } from '@/types/apps/positionTypes'

// // Component Imports
//import TableFilters from './TableFilters'
import PositionDrawerForm from './PositionDrawerForm'

import CustomTextField from '@core/components/mui/TextField'

// import CustomAvatar from '@core/components/mui/Avatar'

// // Util Imports
//import { getInitials } from '@/utils/getInitials'

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
//const Icon = styled('i')({})

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
  positioncode: '',
  desc: '',
  level: '',
  ref: '',
  status: 'Y',
  remark: '',
  create_date: '',
  create_by: '',
  update_date: '',
  update_by: ''
}

// Column Definitions
const columnHelper = createColumnHelper<PositionsTypeWithAction>()

type Props = {
  tableData?: PositionsType[]
}

const PositionListTable = ({ tableData }: Props) => {
  // States
  const [addPositionOpen, setAddPositionOpen] = useState(false)
  const [openMode, setOpenMode] = useState<any>('') // insert-one || update-one || insert-many || update-many
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectRowCount, setSelectRowCount] = useState<any>(0)
  const [updateDatas, setUpdateDatas] = useState<any[]>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [curMaxPos, setCurMaxPos] = useState()

  //Alert
  const [confirm, setConfirm] = useState<boolean>(false)
  const [deletePos, setDeletePos] = useState<any>({})
  const handleCloseConfirm = () => setConfirm(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOptMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const { data: session } = useSession()
  const token = session?.user.token

  const handleOptMenuClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    getMaxPosCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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

  const getMaxPosCode = async () => {
    let newTableData: any = []

    newTableData = data

    let maxValue = 0
    const values = Object.values(newTableData)

    values.map((el: any) => {
      const valueFromObject = Number(el.positioncode)

      maxValue = Math.max(maxValue, valueFromObject)
    })

    let maxPosition: any = maxValue
    let maxPositionStr: any = ''

    maxPosition++
    if (maxPosition < 99) maxPositionStr = '0' + String(maxPosition)
    setCurMaxPos(maxPositionStr)

    return maxPosition
  }

  const PositionDrawerOpenHandle = (mode: any) => {
    initialData = {
      positioncode: '',
      desc: '',
      level: '',
      ref: '',
      status: 'Y',
      remark: '',
      create_date: '',
      create_by: '',
      update_date: '',
      update_by: ''
    }
    setOpenMode(mode)
    setAddPositionOpen(true)

    setAnchorEl(null)
  }

  const updatePositionList = async () => {
    try {
      const reqBody = { token: session?.user.token }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/list`, reqBody, { headers })

      setData(response.data.data.detail)

      return response.data.data.detail
    } catch (err) {
      console.log(err)
    }

    //}
  }

  const handleDeletePosition = async () => {
    const reqBody: any = deletePos
    const positioncode: object = { positioncode: reqBody.positioncode }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/delete`, positioncode)

      if (response.data.message === 'success') {
        handleCloseConfirm()
        updatePositionList()
      } else {
        console.error('Position delete failed')
      }
    } catch (error: any) {
      console.log('Delete Position failed. ', error.message)
    }
  }

  const handleDeletePositions = async () => {
    const reqBody: any = updateDatas

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/deleteMany`, reqBody)

      if (response.data.message === 'success') {
        handleCloseConfirm()
        updatePositionList()
        setRowSelection({})
      } else {
        console.error('Delete Position failed.')
      }
    } catch (error: any) {
      console.log('Delete Position failed. ', error.message)
    }
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<PositionsTypeWithAction, any>[]>(
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
      columnHelper.accessor('positioncode', {
        header: 'Positionode',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.positioncode}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('desc', {
        header: 'Position Name',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.desc}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('level', {
        header: 'Level',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.level}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.status === 'N' ? 'ยกเลิก' : 'ปกติ'}
            </Typography>
          </div>
        )
      }),

      //   columnHelper.accessor('ref', {
      //     header: 'Ref',
      //     cell: ({ row }) => (
      //       <div className='flex flex-col'>
      //         <Typography color='text.primary' className='font-medium'>
      //           {row.original.ref}
      //         </Typography>
      //       </div>
      //     )
      //   }),
      //   columnHelper.accessor('remark', {
      //     header: 'Remark',
      //     cell: ({ row }) => (
      //       <div className='flex flex-col'>
      //         <Typography color='text.primary' className='font-medium'>
      //           {row.original.remark}
      //         </Typography>
      //       </div>
      //     )
      //   }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setConfirm(true)
                setOpenMode('delete-one')
                setDeletePos({ positioncode: row.original.positioncode, desc: row.original.desc })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                // initialData.password = ''
                initialData.positioncode = row.original.positioncode
                initialData.desc = row.original.desc
                initialData.level = row.original.level
                initialData.ref = row.original.ref
                initialData.status = row.original.status
                initialData.remark = row.original.remark
                initialData.update_date = row.original.update_date
                initialData.update_by = row.original.update_by
                setAddPositionOpen(!addPositionOpen)
                setOpenMode('update-one')
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
    data: data as PositionsType[],
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
        <CardHeader title='Position' className='pbe-4' />
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
              placeholder='Search Position Name'
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
              onClick={() => PositionDrawerOpenHandle('insert-one')}
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
                <MenuItem onClick={() => PositionDrawerOpenHandle('insert-many')}>
                  <ListItemIcon>
                    <i className='tabler-plus text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Add Multiple' />
                </MenuItem>
                {/* <MenuItem onClick={() => PositionDrawerOpenHandle('update-many')}>
                  <ListItemIcon>
                    <i className='tabler-pencil text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Edit Selected' />
                </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    setConfirm(true)
                    setOpenMode('delete-many') //setAddUserOpen(true)
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
                <MenuItem onClick={() => PositionDrawerOpenHandle('insert-many')}>
                  <ListItemIcon>
                    <i className='tabler-plus text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Add Multiple' />
                </MenuItem>
                {/* <MenuItem disabled>
                  <ListItemIcon>
                    <i className='tabler-pencil text-xl' />
                  </ListItemIcon>
                  <ListItemText primary='Edit Selected' />
                </MenuItem> */}
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
                        width:
                          header.index === 0
                            ? 60
                            : 'auto' && header.index === 1
                              ? 100
                              : 'auto' && header.index == 3
                                ? 80
                                : 'auto' && header.index == 4
                                  ? 80
                                  : 'auto' && header.index == 5
                                    ? 160
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
          <DialogContentText className='text-center' id='alert-dialog-description'>
            Do you want to delete ?
            {openMode == 'delete-one' && <Typography color='primary'>{deletePos.desc}</Typography>}
            {openMode == 'delete-many' &&
              updateDatas?.map((elem: any, index: any) => {
                return (
                  <div key={index} className='text-primary'>
                    {elem.desc}
                  </div>
                )
              })}
          </DialogContentText>
        </DialogContent>
        <DialogActions className='justify-center pbs-5 sm:pbe-10 sm:pli-16'>
          <Button variant='tonal' color='error' onClick={handleCloseConfirm}>
            Cancal
          </Button>
          {openMode == 'delete-one' && (
            <Button color='error' variant='contained' onClick={handleDeletePosition}>
              Yes, delete it ?
            </Button>
          )}
          {openMode == 'delete-many' && (
            <Button color='error' variant='contained' onClick={handleDeletePositions}>
              Yes, delete it?
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <PositionDrawerForm
        open={addPositionOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        mode={openMode}
        handleClose={() => setAddPositionOpen(!addPositionOpen)}
        updatePositionList={updatePositionList}
        curMaxPos={curMaxPos}
      />
    </>
  )
}

export default PositionListTable
