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
import Avatar from '@mui/material/Avatar'
import MuiAvatar from '@mui/material/Avatar'

//AKK IMPORT DIALOG
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useSession } from 'next-auth/react'

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
import type { GroupType, GroupTypeWithAction, MemberType } from '@/types/apps/groupTypes'

// // Component Imports
// import TableFilters from './TableFilters'

import GroupDrawerForm from './GroupDrawerForm'
import type { UsersType } from '@/types/apps/userTypes'

import CustomTextField from '@core/components/mui/TextField'
// import CustomAvatar from '@core/components/mui/Avatar'

// // Util Imports
import { getInitials } from '@/utils/getInitials'
// import { getLocalizedUrl } from '@/utils/i18n'

// // Style Imports
import tableStyles from '@core/styles/table.module.css'
import { any, object, string } from 'zod'

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
  groupid: '',
  groupname: '',
  createby: '',
  member: []
}

let idData = {
  groupid: Number(string)
}

// member AKK HERE
const memberObj: MemberType = {}

// Column Definitions
const columnHelper = createColumnHelper<GroupTypeWithAction>()

type Props = {
  tableData?: GroupType[]
  memberData?: MemberType[]
  userData?: UsersType[]
  email?: string
}

// AKK select/add user

const GruopListTable = ({ tableData, memberData, userData, email }: Props) => {
  // AKK HERE
  // States
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [user, setusersData] = useState(...[userData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [members, setMembers] = useState([])

  //AKK
  const { data: session, update } = useSession()
  const [emailData, setEmailData] = useState(session?.user.email)
  const [memberopen, setmemberOpen] = useState(false)
  // const [members, setmembers] = useState([])
  // var members = ['admin@excelink.co.th', 'chulapak@excelink.co.th', 'supachai@excelink.co.th']
  var mbs = []
  const handleClickOpen = async (groupid: object, member: any) => {
    var i: any
    var elem: any = member
    for (i in elem) {
      setMembers(elem[i])
    }

    setmemberOpen(true)
  }

  // console.log(setmembers(members))
  const handleDialogClose = () => setmemberOpen(false)

  const handleCloseeee = (value: string) => {
    setmemberOpen(false)
    // setSelectedValue(value)
  }

  const GroupDrawerOpenHandle = () => {
    initialData = {
      groupid: '',
      groupname: '',
      createby: '',
      member: []
    }

    // let idData = {
    //   groupid: Number(string)
    // }

    setAddGroupOpen(true)
  }

  // Delete
  const handleDeleteGroup = async (groupid: object) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/delete`, groupid)

      if (response.data.message === 'success') {
        console.log(response.data.data.detail)

        //todo update tableData
        const em: any = groupid
        const newUpdate = tableData?.filter(el => el.groupid !== em.groupid)

        console.log('newUpdate === ', newUpdate)
        setData(newUpdate)

        tableData = data

        console.log(tableData)

        //todo update refresh token
        console.log('Update token ===', response.data.token)
      } else {
        console.error('Group delete failed')
      }
    } catch (error: any) {
      console.log('Delete group failed. ', error.message)
    }
  }
  // Table Columns config
  const columns = useMemo<ColumnDef<GroupTypeWithAction, any>[]>(
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
      columnHelper.accessor('groupname', {
        header: 'Group Name',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.groupname}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('member', {
        header: 'Member',
        cell: ({ row }) => (
          <div className='flex flex-col-2'>
            {/* <Typography color='text.primary' className='font-medium'>
              Selected: {selectedValue}
            </Typography> */}
            <Button
              variant='tonal'
              onClick={() => {
                handleClickOpen({ groupid: row.original.groupid }, { member: row.original.member })
              }}
            >
              {row.original.member.length}
            </Button>
            {/* <Typography color='text.primary' className='font-medium'>
              {row.original.member.length}
            </Typography> */}
            {/* {row.original.member.map(member => (
              <Typography color='text.primary' className='font-medium'>
                {member}
              </Typography>
            ))} */}
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                handleDeleteGroup({ GroupId: row.original.groupid })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                // initialData.password = ''
                // initialData.groupid = row.original.groupid
                initialData.groupid = row.original.groupid
                initialData.groupname = row.original.groupname
                setAddGroupOpen(!addGroupOpen)
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
    data: data as GroupType[],
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
              onClick={() => GroupDrawerOpenHandle()}
              className='is-full sm:is-auto'
            >
              Add New Group
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
      <Dialog
        onClick={() => {
          handleDialogClose()
        }}
        aria-labelledby='simple-dialog-title'
        open={memberopen}
      >
        <DialogTitle id='simple-dialog-title'>Member</DialogTitle>

        <List className='pt-0 px-0'>
          {members?.map((email, index) => (
            <ListItem key={email} disablePadding onClick={() => handleCloseeee(email)}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    <i className='tabler-user' />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <GroupDrawerForm
        open={addGroupOpen}
        setData={setData}
        tableData={tableData}
        userData={userData}
        updateData={initialData}
        // updateIDData={idData}
        handleClose={() => setAddGroupOpen(!addGroupOpen)}
      />
    </>
  )
}
export default GruopListTable
