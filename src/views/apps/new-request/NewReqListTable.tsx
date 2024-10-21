'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

import Link from 'next/link'

import { useSession } from 'next-auth/react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
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

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { Input } from 'valibot'

import TablePaginationComponent from '@components/TablePaginationComponent'
import type { NewReqType, NewReqTypeWithAction } from '@/types/apps/newRequestTypes'

import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { NewWorkSchema } from '@/schemas/newRequestSchema'
import axios from '@/utils/axios'

// import { getEdata } from '@/utils/hooks/formRender'

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

// Column Definitions
const columnHelper = createColumnHelper<NewReqTypeWithAction>()

type Props = {
  tableData?: NewReqType[]
}

type FormData = Input<typeof NewWorkSchema>
type ErrorType = {
  message: string[]
}

const NewReqListTable = ({ tableData }: Props) => {
  const initialData: any = {
    registerdep: '',
    Registerdep: '',
    Subject: ''
  }

  // States
  const [rowSelection, setRowSelection] = useState({})
  const [formData, setFormData] = useState(...[initialData])
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')
  const [open, setOpen] = useState<boolean>(false)
  const [createLink, setCreateLink] = useState<any>({})
  const { data: session } = useSession()
  const userData: any = session?.user

  useEffect(() => {
    userData?.dep && (formData.Registerdep = userData?.dep[0].depid)
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(NewWorkSchema),
    defaultValues: {
      Subject: ''
    }
  })

  const getEformData = async () => {
    // Vars

    try {
      const reqBody = {
        rid: createLink.workflowid,
        token: session?.user.token,
        email: session?.user.email
      }

      const headers = {
        Authorization: `Bearer ${reqBody.token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/eforms`, reqBody, { headers })

      console.log('response.data --- ')
      console.log(response.data)

      if (response.data.message === 'success') {
        return response.data
      } else {
        throw new Error('Failed to fetch eform data')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickOpen = async (row: any) => {
    setOpen(true)
    console.log('row')
    console.log(row.original)

    const linkData = {
      routename: row.original.routename[0],
      workflowid: row.original.workflowid,
      pathname: '/en/work/create',
      query: `dep=${row.original.basketid}&rid=${row.original.workflowid}&pid=${row.original.processid}&routename=${row.original.routename}`
    }

    console.log('linkData')
    console.log(linkData)

    setCreateLink(linkData)

    console.log('createLink')
    console.log(createLink)

    // const newInitialData = { registerdep: '', Registerdep: userData?.dep[0].depid, Subject: '' }

    // setFormData(newInitialData)

    // userData?.dep && (formData.Registerdep = userData?.dep[0].depid)
  }

  const handleClose = () => {
    setOpen(false)

    setFormData(initialData)
  }

  const onSubmit = async () => {
    // const eformData = await getEdata(workData)
    const eformDataObj = await getEformData()

    const eformDataDetail = eformDataObj.data

    const eformData = []

    for (const elem of eformDataDetail) {
      const newData = {
        Form_id: elem._id,
        Form_template: elem.form_template
      }

      eformData.push(newData)
    }

    // const eformData: any = []

    const date: Date = new Date()

    const data = {
      Registerdate: date,
      Registerdep: formData.Registerdep,
      Registeruid: session?.user.email,
      Subject: formData.Subject,
      Status: 'workflow',
      EformData: eformData,
      WorkflowId: createLink.workflowid,
      Blockid: 'startpoint'
    }

    // console.log('reqBody - data ===')
    // console.log(data)

    // return

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/create`, data)

      if (response.data.message === 'success') {
        console.log('Create work success.')
        const wid = response.data.data
        const path = `${process.env.NEXT_PUBLIC_APP_URL}/en/work?wid=${wid}&wip=&dep=${formData.Registerdep}&routename=${createLink.routename}&workflowid=${createLink.workflowid}`

        console.log('wid')
        console.log(wid)
        console.log('path')
        console.log(path)

        // redirect(path)
        window.location.href = path

        // navigate(path)
      }
    } catch (error: any) {
      console.log('Create work failed. ', error.message)
    }
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<NewReqTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('routename', {
        header: 'App Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4 cursor-pointer' onClick={() => handleClickOpen(row)}>
            <div className='flex flex-col'>
              {/* <Link
                href={{
                  pathname: '/en/work/create',
                  query: `dep=${row.original.basketid}&rid=${row.original.workflowid}&pid=${row.original.processid}&routename=${row.original.routename}`
                }}
              > */}
              <Typography color='text.primary' className='font-medium'>
                {row.original.routename}
              </Typography>
              {/* </Link> */}
            </div>
          </div>
        )
      }),

      columnHelper.accessor('client_alias', {
        header: 'Client Alias',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Link
              href={{
                pathname: '/en/work/create',
                query: `dep=${row.original.basketid}&rid=${row.original.workflowid}&pid=${row.original.processid}&routename=${row.original.routename}`
              }}
            >
              <Typography className='capitalize' color='text.primary'>
                {row.original.client_alias}
              </Typography>
            </Link>
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // Table config
  const table = useReactTable({
    data: data as NewReqType[],
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
        <CardHeader title='New Request' className='pbe-4' />
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
              placeholder='Search Route Name'
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
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Create new request
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <Typography className='text-xs'>Route name:</Typography>
          <Typography className='font-bold pb-4'>{createLink.routename}</Typography>
          <form noValidate autoComplete='off' className='flex flex-col gap-6'>
            {/* <div className='flex gap4 flex-col'> */}
            {/* <div className='flex-1 flex flex-col items-start'>
                <Typography className='text-xs flex'>Created by:</Typography>
                <Typography className='font-bold flex pb-4'>{session?.user ? session.user.name : '--'}</Typography>
                <FormControl variant='standard' fullWidth>
                  <InputLabel id='department-select-label'>Select department </InputLabel>
                  <Select
                    label='Select department'
                    labelId='department-select-label'
                    value={formData.Registerdep}
                    id='department-select' //defaultValue={userDefaultDep.toString()}
                    className='text-left' // onChange={e => (initialData.Registerdep = e.target.value)}
                    onChange={e => setFormData({ ...formData, Registerdep: e.target.value })}
                  >
                    {userData &&
                      userData.dep.map((dep: any, index: any) => {
                        return (
                          <MenuItem key={index} value={dep.depid}>
                            {dep.depname} / {dep.positionname}
                          </MenuItem>
                        )
                      })}
                  </Select>
                </FormControl>
              </div> */}
            <div className='flex-1 flex  items-start justify-start'>
              <Controller
                name='Subject'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    required
                    fullWidth
                    label='Subject'
                    placeholder='Enter subject'
                    value={formData.Subject}
                    onChange={e => {
                      setFormData({ ...formData, Subject: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.Subject || errorState !== null) && {
                      error: true,
                      helperText: errors?.Subject?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </div>
            {/* <div className='flex-1 flex  items-start justify-start'>
              <Controller
                name='Registerdep'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    required
                    fullWidth
                    label='Registerdep'
                    placeholder='Enter Registerdep'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.Registerdep || errorState !== null) && {
                      error: true,
                      helperText: errors?.Registerdep?.message || errorState?.message[0]
                    })}
                  />
                )}
              />
            </div> */}
            <div className='flex-1 flex items-start justify-start'>
              <CustomTextField
                select
                autoFocus
                required
                fullWidth
                label='Select department'
                value={formData.Registerdep}
                onChange={e => {
                  setFormData({ ...formData, Registerdep: e.target.value })
                }}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {userData &&
                  userData.dep.map((dep: any, index: any) => {
                    return (
                      <MenuItem key={index} value={dep.depid}>
                        {dep.depname} / {dep.positionname}
                      </MenuItem>
                    )
                  })}
              </CustomTextField>
            </div>
            {/* </div> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='tonal' color='secondary'>
            Close
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant='contained'>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NewReqListTable
