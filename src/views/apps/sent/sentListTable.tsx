'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// import { redirect } from 'next/navigation'
import { useParams } from 'next/navigation'

import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import Chip from '@mui/material/Chip'
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

import { IconButton } from '@mui/material'

import { useSession } from 'next-auth/react'

import TablePaginationComponent from '@components/TablePaginationComponent'
import type { SentType, SentTypeWithAction } from '@/types/apps/sentTypes'

// Component Imports
import TableFilters from './TableFilters'

// import UserDrawerForm from './UserDrawerForm'

import CustomTextField from '@core/components/mui/TextField'

// Util Imports
// import { getInitials } from '@/utils/getInitials'
// import { getLocalizedUrl } from '@/utils/i18n'
// import type { Locale } from '@configs/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TrackingDrawerInfo from '../new-request/list/TrackingDrawerInfo'
import axios from '@/utils/axios'

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
// const initialData = {
//   workflowid: '',
//   wid: '',
//   userid: '',
//   user_field: [''],
//   task: [''],
//   subject: '',
//   status: '',
//   statecode: '',
//   registeruid: '',
//   registerdep: '',
//   processname: '',
//   pagetargetid: '',
//   pagesourceid: '',
//   nodeid: '',
//   lastname: '',
//   firstname: '',
//   eformlist: [''],
//   connectionid: '',
//   conditions: '',
//   blockid: '',
//   basketid: '',
//   Registerdate: '',
//   Expiredate: '',
//   Completedate: ''
// }

// Column Definitions
const columnHelper = createColumnHelper<SentTypeWithAction>()

type Props = {
  tableData?: SentType[]
  depData?: any
}

const SentListTable = ({ tableData, depData }: Props) => {
  // States
  //const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [activityData, setActivityData] = useState([])
  const [workInfo, setWorkInfo] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [trackingOpen, setTrackingOpen] = useState(false)

  console.log('tableData =====')
  console.log(tableData)

  console.log('depData ===')
  console.log(depData)

  const { data: session } = useSession()

  // Hooks
  const { lang: locale } = useParams()

  const getData = async ({ wid, dep }: { wid?: any; dep?: any }) => {
    // Vars
    // const session = await getServerSession(options)

    try {
      const reqBody = {
        wid: wid,
        dep: dep,
        token: session?.user.token,
        email: session?.user.email
      }

      const headers = {
        Authorization: `Bearer ${reqBody.token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/list`, reqBody, { headers })

      if (response.data.message === 'success') {
        return response
      } else {
        throw new Error('Failed to fetch workdata')
      }
    } catch (err: any) {
      console.log('--work/list response ---')
      console.log(err)

      throw new Error(err.message)
    }
  }

  const userDrawerOpenHandle = async (wid: any, dep: any, subject: any) => {
    const res = await getData({ wid, dep })

    const activity = res.data.data.activity
    const work: any = { wid: wid, subject: subject }

    setWorkInfo(work)

    setActivityData(activity)

    setTrackingOpen(true)
  }

  // Table Columns config
  const columns = useMemo<ColumnDef<SentTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('viewstatus', {
        header: '',
        size: 54,
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-row gap-2'>
              <Icon className='text-[22px] text-slate-300 tabler-bell' />
              {row.original.viewstatus ? (
                <Icon className='text-[22px] text-slate-300 tabler-star' />
              ) : (
                <Icon className='text-[22px] text-amber-300 tabler-star-filled' />
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('subject', {
        header: 'Subject',
        cell: ({ row }) => (
          <Link
            href={{
              pathname: `/${locale}/work`,
              query: `wid=${row.original.wid}`
            }}
          >
            <div className='flex flex-col '>
              <Typography color='text.primary' className='font-medium'>
                {row.original.subject ? row.original.subject : '-'}
              </Typography>
              <div className='flex flex-col'>
                <div>
                  <Typography variant='body2'>{row.original.routename}</Typography>
                </div>
                <div className=''>
                  {row.original.wid && (
                    <Chip
                      className='mr-2'
                      label={row.original.wid}
                      size='small'
                      color='secondary'
                      variant='tonal'
                      icon={<i className='tabler-grid-pattern' />}
                    />
                  )}
                  {row.original.status && (
                    <Chip
                      variant='tonal'
                      size='small'
                      title='Work type'
                      className='mr-2'
                      label={row.original.status}
                      color='warning'
                    />
                  )}
                  {row.original.currentdeptname && (
                    <Chip
                      variant='tonal'
                      size='small'
                      title='Request by Department'
                      label={row.original.currentdeptname}
                      color='info'
                    />
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      }),
      columnHelper.accessor('createdate', {
        header: 'Request Date',
        sortingFn: 'datetime',
        cell: ({ row }) => (
          <Link
            href={{
              pathname: `/${locale}/work`,
              query: `wid=${row.original.wid}`
            }}
          >
            <div className='flex items-center gap-2'>
              <Typography className='text-sm' color='text.primary'>
                {formatshortdate(row.original.createdate)}
              </Typography>
            </div>
          </Link>
        )
      }),
      columnHelper.accessor('processname', {
        header: 'Work in Process',
        cell: ({ row }) => (
          <Link
            href={{
              pathname: `/${locale}/work`,
              query: `wid=${row.original.wid}`
            }}
          >
            <Typography color='text.primary' className='font-medium'>
              {row.original.processname}
            </Typography>
            <Typography variant='body2' color='text.disabled' title='Received Date'>
              {formatshortdate(row.original.datein)}
            </Typography>
          </Link>
        )
      }),

      columnHelper.accessor('action', {
        header: () => (
          <div
            style={{
              textAlign: 'center'
            }}
          >
            Tracking
          </div>
        ),

        cell: ({ row }) => (
          <div className='text-center'>
            <IconButton
              onClick={() => userDrawerOpenHandle(row.original.wid, row.original.currentdept, row.original.subject)}
            >
              <i className='tabler-route-scan text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const formatshortdate = (date: any) => {
    const m_th_names = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย',
      'ธ.ค.'
    ]

    const m_en_names = ['Jan', 'Feb', 'Mar', ' Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const d = new Date(date),
      curr_date = d.getDate(),
      curr_month = d.getMonth(),
      curr_year: number = d.getFullYear() + 543

    const formattedDate = d.toLocaleString()
    const curr_time = formattedDate.split(',')[1]

    if (locale == 'th') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  // Table config
  const table = useReactTable({
    data: data as SentType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter // search field
    },
    state: {
      //rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },

    //enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,

    //onRowSelectionChange: setRowSelection,
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
        <CardHeader title='Sent' className='pbe-4' />
        <TableFilters setData={setData} tableData={tableData} />
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
              placeholder='Search Sent'
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
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize() !== 150 ? header.getSize() : undefined
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

            {/* { table.getFilteredRowModel().rows.length === 0 ? ( */}
            {tableData === null || tableData === undefined ? (
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
        {tableData && (
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
          />
        )}
      </Card>
      <TrackingDrawerInfo
        open={trackingOpen}
        trackingData={activityData}
        workInfo={workInfo}
        handleClose={() => setTrackingOpen(!trackingOpen)}
      />
    </>
  )
}

export default SentListTable
