'use client'

// MUI Imports
import { useEffect, useState, useMemo } from 'react'

// React Imports

// import styled from "styled-components";

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'

//AKK IMPORT DIALOG
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Chip from '@mui/material/Chip'

// import type { SelectChangeEvent } from '@mui/material/Select'

import ListItemText from '@mui/material/ListItemText'

// import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Tooltip from '@mui/material/Tooltip'
import AvatarGroup from '@mui/material/AvatarGroup'

import { useSession } from 'next-auth/react'

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

import DialogCloseButton from '@components/dialogs/DialogCloseButton'

// Util Imports
// import { getInitials } from '@/utils/getInitials'

// import type { Locale } from '@configs/i18n'

import TablePaginationComponent from '@components/TablePaginationComponent'

// import type { ThemeColor } from '@core/types'
import type { GroupType, GroupTypeWithAction, MemberType, GroupFormDataType } from '@/types/apps/groupTypes'

// // Component Imports
// import TableFilters from './TableFilters'

import GroupDrawerForm from './GroupDrawerForm'
import type { UsersType } from '@/types/apps/userTypes'

import CustomTextField from '@core/components/mui/TextField'

// import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports

// import { getLocalizedUrl } from '@/utils/i18n'

//Style Imports
import tableStyles from '@core/styles/table.module.css'

import getGroupList from '@components/groups/getGroupList'

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

// Vars
let initialData = {
  groupid: '',
  groupname: '',
  createby: '',
  member: ['null']
}

// Column Definitions
const columnHelper = createColumnHelper<GroupTypeWithAction>()

type Props = {
  tableData?: GroupType[]
  memberData?: MemberType[]
  userData?: UsersType[]
  email?: string
  updateData?: GroupFormDataType

  // onChange?: (e?: Event) => void
}

// AKK select/add user

const GroupListTable = ({ tableData, userData }: Props) => {
  // States
  const [personName, setPersonName] = useState<string[]>([])
  const [dataGroup, setDataGroup] = useState<any>({})
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])

  const [globalFilter, setGlobalFilter] = useState('')
  const [members, setMembers] = useState<any>([])
  const [memberopen, setmemberOpen] = useState(false)
  const { data: session } = useSession()

  const emailData = session?.user.email

  //Alert
  const [confirm, setConfirm] = useState<boolean>(false)
  const [deleteGroup, setDeleteGroup] = useState<any>({})
  const handleCloseConfirm = () => setConfirm(false)

  const getGroupData = async () => {
    const newData = await getGroupList()

    return newData
  }

  const handleSubmitMember = async () => {
    console.log('SubmitMember-start')
    const newMember: any = members

    for (const item of personName) {
      //members.push(item)
      newMember.push(item)
      console.log(newMember)
    }

    setMembers(newMember)

    const updateFormdata: any = {
      groupid: dataGroup.groupid,
      groupname: dataGroup.groupname,
      createby: String(emailData),
      member: members
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/update`, updateFormdata)

      if (response.data.message === 'success') {
        console.log('Update user success.')
        setMembers(members)
        handleCloseMembers()
      }
    } catch (error: any) {
      console.log('Update Team member failed. ', error.message)
    }

    handleCloseMembers()
  }

  const handleDeleteMember = async (email: any) => {
    console.log(email)

    const updatedMembers = members.filter((newMember: any) => newMember !== email)

    if (updatedMembers.length !== members.length) {
      const members = updatedMembers

      console.log('Updated Members ----- ', members)

      setMembers(members)

      const updateFormdata: any = {
        groupid: dataGroup.groupid,
        groupname: dataGroup.groupname,
        createby: String(emailData),
        member: members
      }

      console.log(updateFormdata)

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/update`, updateFormdata)

        if (response.data.message === 'success') {
          console.log('Update user success.')

          // handleReset()
        }
      } catch (error: any) {
        console.log('Update Team member failed. ', error.message)
      }
    } else {
      console.log('ไม่เจอ')
    }
  }

  useEffect(() => {}, [members])

  const handleClickOpenMember = async (groupid: object, member: any) => {
    console.log('handleClickOpenMember')
    let i: any
    const elem: any = member

    console.log(member)

    for (i in elem) {
      setMembers(elem[i])
    }

    setmemberOpen(true)
    setDataGroup(groupid)
  }

  // console.log(setmembers(members))
  // const handleDialogClose = () => setmemberOpen(false)

  const handleCloseMembers = () => {
    setmemberOpen(false)

    // handleReset()
    setPersonName([])

    // setSelectedValue(value)
  }

  const GroupDrawerOpenHandle = () => {
    console.log(members)
    initialData = {
      groupid: '',
      groupname: '',
      createby: '',
      member: ['null']
    }
    setAddGroupOpen(true)
  }

  // Reset
  // const handleReset = () => {
  //   handleCloseMembers()
  //   setPersonName([])
  // }

  // Delete
  const handleDeleteGroup = async () => {
    const reqBody: any = deleteGroup
    const groupid: object = { groupid: reqBody.groupid }

    console.log(groupid)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/delete`, groupid)

      if (response.data.message === 'success') {
        console.log(response.data.data.detail)
        handleCloseConfirm()

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
            {/* <Button
              variant='tonal'
              onClick={() => {
                handleClickOpenMember(
                  { groupid: row.original.groupid, groupname: row.original.groupname },
                  { member: row.original.member }
                )
              }}
            >
              {String(row.original.member) == 'null' ? 0 : null}
              {String(row.original.member) != 'null' ? row.original.member.length : null}
            </Button> */}

            <AvatarGroup max={4}>
              {row.original.member.map((person, index) => (
                <Tooltip title={person} key={index}>
                  <Avatar
                    src={person}
                    onClick={() => {
                      handleClickOpenMember(
                        { groupid: row.original.groupid, groupname: row.original.groupname },
                        { member: row.original.member }
                      )
                    }}
                  ></Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setConfirm(true)
                setDeleteGroup({ groupid: row.original.groupid, groupname: row.original.groupname })
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton
              onClick={() => {
                initialData.groupid = row.original.groupid
                initialData.groupname = row.original.groupname
                initialData.member = row.original.member
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

  // const handleChange = (event: SelectChangeEvent<string[]>) => {
  const handleChange = (event: any) => {
    setPersonName(event.target.value as string[])
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='User Group' className='pbe-4' />
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
              placeholder='Search Group Name'
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
              onClick={() => GroupDrawerOpenHandle()}
              className='is-full sm:is-auto'
            >
              Add New
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            {/* <thead style={{ backgroundColor: 'pink' }}> */}
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      style={{
                        width: header.index === 1 ? 60 : 'auto' && header.index === 2 ? 180 : 'auto'
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
        fullWidth
        open={memberopen}
        onClose={handleCloseMembers}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => handleCloseMembers()} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          Team member
          <Typography component='span' className='flex flex-col text-center'>
            Share project with the team member
          </Typography>
        </DialogTitle>
        <form onSubmit={e => e.preventDefault()}>
          <DialogContent className='MuiDialogContent-root flex flex-col gap-6 pbs-0 sm:pli-16 sm:pbe-16 mui-18zuta7'>
            <div>
              <CustomTextField
                select
                fullWidth
                label='Add Members'
                value={personName}
                id='demo-multiple-chip'
                SelectProps={{
                  multiple: true,
                  MenuProps,
                  onChange: e => handleChange(e),
                  renderValue: selected => (
                    <div className='flex flex-wrap gap-1'>
                      {(selected as unknown as string[]).map(value => (
                        <Chip key={value} label={value} size='small' />
                      ))}
                    </div>
                  )
                }}
              >
                {userData?.map((name, index) => (
                  <MenuItem key={index} value={name.email}>
                    {name.firstname + ' ' + name.lastname}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
            <div className='flex flex-col gap-4'>
              {members.length} Members
              <List className='pt-0 px-0'>
                {members?.map((email: any, index: any) => (
                  <ListItem key={index} disablePadding onClick={() => handleCloseMembers()}>
                    <ListItemAvatar>
                      <Avatar>
                        <i className='tabler-user' />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={email} />
                    <ListItemSecondaryAction>
                      <IconButton edge='end' size='small' onClick={() => handleDeleteMember(email)}>
                        <i className='tabler-trash-x' />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          </DialogContent>

          <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
            <Button variant='contained' onClick={() => handleSubmitMember()} type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleCloseMembers()}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
            Do you want to delete ? <Typography color='primary'>{deleteGroup.groupname}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='justify-center pbs-5 sm:pbe-10 sm:pli-16'>
          <Button variant='tonal' color='error' onClick={handleCloseConfirm}>
            Cancal
          </Button>
          <Button color='error' variant='contained' onClick={handleDeleteGroup}>
            Yes, delete it?
          </Button>
        </DialogActions>
      </Dialog>

      <GroupDrawerForm
        open={addGroupOpen}
        setData={setData}
        userData={userData}
        updateData={initialData}
        handleClose={() => setAddGroupOpen(!addGroupOpen)}
        getGroupData={getGroupData}
      />
    </>
  )
}

export default GroupListTable
