'use client'
import { useEffect, useState, useMemo } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import {
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  Chip,
  IconButton,
  MenuItem,
  TablePagination,
  Tooltip,
  Typography
} from '@mui/material'

import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

import type { RankingInfo } from '@tanstack/match-sorter-utils'

import tableStyles from '@core/styles/table.module.css'

import type { CommentType, CommentTypeWithAction } from '@/types/apps/commentTypes'

// import { socket } from '@/components/socket/socket'

// import OptionMenu from '@/@core/components/option-menu'

// import Link from '@components/Link'
import CustomTextField from '@/@core/components/mui/TextField'
import TablePaginationComponent from '@/components/TablePaginationComponent'

import CommentDrawer_v2 from './CommentDrawer_v2'

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

// Column Definitions
const columnHelper = createColumnHelper<CommentTypeWithAction>()

const CommentListTable = ({ commentData }: { commentData?: any }) => {
  // const [data, setData] = useState(...[commentData])
  const data = commentData
  const [widData, setWidData] = useState('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [commentOpen, setCommentOpen] = useState(false)

  // const [isConnected, setIsConnected] = useState(false)
  // const [transport, setTransport] = useState('N/A')

  // useEffect(() => {
  //   console.log('try connect to socket')

  //   if (socket.connected) {
  //     onConnect()
  //   }

  //   function onConnect() {
  //     console.log('socket on connected')
  //     setIsConnected(true)
  //     setTransport(socket.io.engine.transport.name)

  //     socket.io.engine.on('upgrade', transport => {
  //       setTransport(transport.name)
  //     })
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false)
  //     setTransport('N/A')
  //   }

  //   socket.on('connect', onConnect)
  //   socket.on('disconnect', onDisconnect)

  //   return () => {
  //     socket.off('connect', onConnect)
  //     socket.off('disconnect', onDisconnect)
  //   }
  // }, [])

  // console.log('commentData ---------------- ')
  // console.log(commentData)

  // Hooks
  const { lang: locale } = useParams()

  const router = useRouter()

  const getWorkData = async (wid: any) => {
    setWidData(wid)
    setCommentOpen(true)
  }

  // useEffect(() => {
  //   console.log('commentData')
  //   console.log(commentData)

  //   if (commentData !== null && commentData !== undefined) {
  //     setData(commentData)
  //   }
  // }, [commentData])

  // Table Columns config
  const columns = useMemo<ColumnDef<CommentTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('member', {
        header: '',
        cell: ({ row }) => (
          <div className='flex flex-col-2'>
            <AvatarGroup max={4}>
              {row.original.member.map((person, index) => (
                <Tooltip title={person.username} key={index}>
                  <Avatar
                    src={person.avatar}
                    className='cursor-pointer'
                    onClick={() => router.push(`/en/users/profile/${person.email}`)}
                  ></Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
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
                {row.original.subject}
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
                  {/* {row.original.status && (
                    <Chip variant='tonal' size='small' className='mr-2' label={row.original.status} color='warning' />
                  )}
                  {row.original.currentdeptname && (
                    <Chip variant='tonal' size='small' label={row.original.currentdeptname} color='info' />
                  )} */}
                </div>
              </div>
            </div>
          </Link>
        )
      }),
      columnHelper.accessor('wid', {
        header: '',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                getWorkData(row.original.wid)
              }}
            >
              <i className='tabler-message text-[32px] text-textSecondary' />
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
    data: data as CommentType[], //data: data as CommentType[],
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
        <CardHeader title='Comments' className='pbe-4' />
        {/* <div>
          <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
          <p>Transport: {transport}</p>
        </div> */}
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
              placeholder='Search'
              className='is-full sm:is-auto'
            />
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
                        width: header.index === 0 ? 160 : header.index === 2 ? 180 : 'auto'
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

      <CommentDrawer_v2 wid={widData} open={commentOpen} handleClose={() => setCommentOpen(!commentOpen)} />
    </>
  )
}

export default CommentListTable
