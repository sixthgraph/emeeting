'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

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
import axios from 'axios'

//import type { Locale } from '@configs/i18n'

import TablePaginationComponent from '@components/TablePaginationComponent'

// import type { ThemeColor } from '@core/types'
import type {
  UsersType,
  UserRoleType,
  UsersTypeWithAction,
  UserStatusType,
  RoleType,
  DepType
} from '@/types/apps/userTypes'

// Component Imports
import TableFilters from './TableFilters'
import UserDrawerForm from './UserDrawerForm'
import UsersDrawerForm from './UsersDrawerForm'

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

// Vars
const userRoleObj: UserRoleType = {
  0: { icon: 'tabler-crown', color: 'error', name: 'Undefined' },
  1: { icon: 'tabler-crown', color: 'error', name: 'Admin' },
  2: { icon: 'tabler-device-desktop', color: 'warning', name: 'Worker' },
  3: { icon: 'tabler-edit', color: 'info', name: 'Viewer' },
  4: { icon: 'tabler-chart-pie', color: 'success', name: 'Super User' }
}

const roleObj: UserRoleType = {
  //0: { icon: 'tabler-crown', color: 'error', name: 'Undefined' },
}

const depObj: DepType = {}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// Vars
let initialData = {
  firstname: '',
  lastname: '',
  fullName: '',
  email: '',
  avatar: '',
  avatarcolor: '',
  password: '',
  dep: ['null'],
  position: '',
  role: 0,
  status: ''
}

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

type Props = {
  tableData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]
}

const UserListTable = ({ tableData, roleData, depData }: Props) => {
  //console.log('depData === ', depData)
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [addUsersOpen, setAddUsersOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

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

  roleData?.map(role => {
    const id = role.roleid
    const name = role.rolename

    //TODO UPDATE ROUTE FLOW API FIELD FOR "ICON, COLOR" AND REPLACE userRoleObj with userRoleObj2
    roleObj[Number(id)] = { icon: 'tabler-crown', color: 'error', name: String(name) }
  })

  // const [updateData, setUpdateData] = useState(...[initialData])

  // Hooks
  //const { lang: locale } = useParams()

  //console.log('data ===', data)

  const userDrawerOpenHandle = () => {
    // sg here
    initialData = {
      firstname: '',
      lastname: '',
      fullName: '',
      email: '',
      avatar: '',
      avatarcolor: '',
      password: '',
      dep: ['null'],
      position: '',
      role: 0,
      status: ''
    }
    setAddUserOpen(true)
  }

  const usersDrawerOpenHandle = () => {
    // sg here
    initialData = {
      firstname: '',
      lastname: '',
      fullName: '',
      email: '',
      avatar: '',
      avatarcolor: '',
      password: '',
      dep: ['null'],
      position: '',
      role: 0,
      status: ''
    }
    setAddUsersOpen(true)
  }

  const handleDeleteUser = async (email: object) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/delete`, email)

      if (response.data.message === 'success') {
        console.log(response.data.data.detail)

        //todo update tableData
        const em: any = email
        const newUpdate = tableData?.filter(el => el.email !== em.email)

        console.log('newUpdate === ', newUpdate)
        setData(newUpdate)

        tableData = data

        console.log(tableData)

        //todo update refresh token
        console.log('Update token ===', response.data.token)
      } else {
        console.error('User delete failed')
      }
    } catch (error: any) {
      console.log('Delete user failed. ', error.message)
    }
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
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
      columnHelper.accessor('firstname', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original.avatar, fullName: row.original.firstname + ' ' + row.original.lastname })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.firstname + ' ' + row.original.lastname}
              </Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('dep', {
        header: 'Department',
        cell: ({ row }) => (
          <>
            {row.original.dep ? (
              row.original.dep.map((dep: any, index: any) => {
                return (
                  <div key={index} className='flex flex-row gap-2'>
                    <Typography color='text.primary' className='font-medium'>
                      {dep.depname}
                    </Typography>
                    <Typography variant='body2'>({dep.positionname})</Typography>
                  </div>
                )
              })
            ) : (
              <Typography color='text.primary' className='font-medium'>
                -
              </Typography>
            )}
          </>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {roleObj[row.original.role] && (
              <Icon
                className={row.original.role && userRoleObj[row.original.role].icon}
                sx={{ color: `var(--mui-palette-${row.original.role && userRoleObj[row.original.role].color}-main)` }}
              />
            )}

            <Typography className='capitalize' color='text.primary'>
              {/* {row.original.role && roleObj[row.original.role].name} */}
              {row.original.role && roleObj[row.original.role] ? roleObj[row.original.role]?.name : '-'}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row.original.status ? (
              <Chip
                variant='tonal'
                className='capitalize'
                label={row.original.status}
                color={userStatusObj[row.original.status]}
                size='small'
              />
            ) : (
              '-'
            )}
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                handleDeleteUser({ email: row.original.email })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                // initialData.password = ''
                initialData.firstname = row.original.firstname
                initialData.lastname = row.original.lastname
                initialData.email = row.original.email
                initialData.dep = row.original.dep
                initialData.position = row.original.position
                initialData.avatar = row.original.avatar
                initialData.role = Number(row.original.role)
                initialData.status = row.original.status

                setAddUserOpen(!addUserOpen)
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
  ) // sg bug here

  // Table config
  const table = useReactTable({
    data: data as UsersType[],
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

  const getAvatar = (params: Pick<UsersType, 'avatar' | 'fullName'>) => {
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
        <CardHeader title='Users' className='pbe-4' />
        <TableFilters setData={setData} tableData={tableData} depData={depData} />
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
              placeholder='Search User'
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
              startIcon={<i className='tabler-user-plus' />}
              onClick={() => userDrawerOpenHandle()}
              className='is-full sm:is-auto'
            >
              Add User
            </Button>
            <Button
              variant='outlined'
              startIcon={<i className='tabler-users-plus' />}
              onClick={() => usersDrawerOpenHandle()}
              className='is-full sm:is-auto'
            >
              Add Users
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
                  .map((row: any, index: any) => {
                    return (
                      <tr key={index} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map((cell: any, idx: any) => (
                          <td key={idx}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
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
      <UserDrawerForm
        open={addUserOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        roleData={roleData}
        depData={depData}
        handleClose={() => setAddUserOpen(!addUserOpen)}
      />
      <UsersDrawerForm
        open={addUsersOpen}
        setData={setData}
        tableData={tableData}
        updateData={initialData}
        roleData={roleData}
        depData={depData}
        handleClose={() => setAddUsersOpen(!addUsersOpen)}
      />
    </>
  )
}

export default UserListTable
