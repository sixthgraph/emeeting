// React Imports
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'

import axios from 'axios'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { Input } from 'valibot'

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

import type { DepType, RoleType, UserFormDataType, UsersType } from '@/types/apps/userTypes'
import { addUserFormSchema } from '@/schemas/formSchema'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type FormData = Input<typeof addUserFormSchema>

type ErrorType = {
  message: string[]
}

type Props = {
  open: boolean
  updateData: UserFormDataType
  setData: any
  setRowSelection: any
  tableData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]
  rowData?: any
  mode?: any
  handleClose: () => void
}

// Vars
const initialData = {
  firstname: '',
  lastname: '',
  fullName: '',
  email: '',
  password: '',
  avatar: '',
  avatarcolor: '',
  dep: [],
  position: '',
  role: 2,
  status: ''
}

const initialInsertData = {
  userData: '',
  password: '',
  role: 2,
  status: '',
  dep: []
}

const UserDrawerForm = ({
  open,
  setData,
  setRowSelection,
  updateData,
  tableData,
  roleData,
  depData,
  rowData,
  mode,
  handleClose
}: Props) => {
  if (updateData.dep.length == 1) {
    if (updateData.dep[0] == 'null') {
      updateData.dep = []
    }
  }

  // States
  const [formData, setFormData] = useState<UserFormDataType>(initialData)
  const [count, setCount] = useState(0)
  const [userDepData, setUserDepData] = useState<any[]>(updateData.dep)

  // const [errors, setErrors] = useState<any[]>([])
  const [selDep, setSelectDep] = useState<any>('')
  const [selDepName, setSelectDepName] = useState<any>('')
  const [selPosition, setSelectPosition] = useState<any[]>([])
  const [updatePosition, setUpdatePosition] = useState<any>('')
  const [updatePositionName, setUpdatePositionName] = useState<any>('')
  const [openAddDep, setOpenAddDep] = useState<boolean>(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [insertData, setInsertData] = useState(initialInsertData)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [errorDepartment, setErrorDepartment] = useState<boolean>(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  //HOOK
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(addUserFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      password: '',
      email: '',
      status: ''

      // insertmany: ''
    }
  })

  useEffect(() => {
    setFormData(updateData)
    setUserDepData(updateData.dep)

    if (open) {
      clearErrors()
    }

    // setErrorState(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    setUserDepData(updateData.dep)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const { data: session } = useSession()
  const token: any = session?.user.token

  const getPositionDep = async (event: any) => {
    const dep = event.target.value
    const curdep = depData?.find(elem => elem.dep == dep)
    const depname = curdep?.depname

    setSelectDep(dep)
    setSelectDepName(depname)
    setUpdatePosition('')
    setUpdatePositionName('')

    try {
      const reqBody = {
        dep: dep,
        token: session?.user.token
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

      if (response.data.message === 'success') {
        const resultPositon = response.data.data.detail

        setSelectPosition(resultPositon)

        return resultPositon
      } else {
        return 'Position not found'
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getSelectPostion = (event: any) => {
    const position = event.target.value
    const curPosition = selPosition.find(elem => elem.positioncode == position)
    const positionname = curPosition?.positiondesc

    setUpdatePosition(position)
    setUpdatePositionName(positionname)
  }

  const handleAddDepOpen = () => {
    setOpenAddDep(true)
    setSelectDep('')
    setSelectDepName('')
    setUpdatePosition('')
    setUpdatePositionName('')
  }

  const handleCloseAddDep = () => setOpenAddDep(false)

  const handleDeleteDepPosition = (depid: any, positionid: any) => {
    const index = updateData.dep.findIndex((x: any) => x.depid === depid && x.positionid === positionid)

    if (index > -1) {
      updateData.dep.splice(index, 1) // 2nd parameter means remove one item only
    }

    setCount(count + 1)
  }

  const handleAddDep = () => {
    const updateNewDep: any = {
      depid: selDep,
      depname: selDepName,
      positionid: updatePosition,
      positionname: updatePositionName
    }

    if (updateData.dep !== null) {
      updateData.dep.push(updateNewDep)
      setCount(count + 1)
    } else {
      const newDep: any = []

      newDep.push(updateNewDep)
      updateData.dep = newDep

      setCount(count + 1)
    }

    handleCloseAddDep()
  }

  const updateUserList = async () => {
    try {
      const reqBody = { token: token }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, reqBody, { headers })

      setData(response.data.data.detail)
      setRowSelection({})
    } catch (err) {
      console.log(err)
    }

    //}
  }

  const onSubmit = async () => {
    if (formData.dep.length == 0) {
      setErrorDepartment(true)

      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, formData)

      if (response.data.success) {
        if (tableData) {
          const updateData: any = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            dep: formData.dep,
            position: formData.position,
            role: Number(formData.role),
            status: formData.status
          }

          tableData.push(updateData)
        }

        //sg call updateUserList and update tableData
        updateUserList()
        handleClose()
      } else {
        console.log('register failed.')
      }
    } catch (error: any) {
      console.log('Add user failed. ', error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData({
      firstname: '',
      lastname: '',
      fullName: '',
      email: '',
      password: '',
      avatar: '',
      avatarcolor: '',
      dep: [],
      position: '',
      role: 2,
      status: ''
    })
  }

  const handleInsertMany = async () => {
    const insertObj = []
    const userDataStr = insertData.userData
    const re = /\n/gi
    const reComma = ', '
    const result = userDataStr.replaceAll(reComma, '\t').replace(re, ',')
    const resultObj = result.split(',')

    let i: any
    const n: any = resultObj

    for (i in n) {
      if (n[i] !== '') {
        const userInfo = n[i]

        const userObj = userInfo.split('\t')

        const newData = {
          firstname: userObj[0],
          lastname: userObj[1],
          fullName: userObj[0] + ' ' + userObj[1],
          email: userObj[2],
          password: insertData.password,
          avatar: '',
          avatarcolor: '',
          dep: updateData.dep,
          position: '',
          role: insertData.role,
          status: insertData.status
        }

        insertObj.push(newData)
      } //if
    } //for

    // return

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/addMany`, insertObj)

      if (response.data.success) {
        updateUserList()
        handleClose()
      }
    } catch (error: any) {
      console.log('Add users failed. ', error.message)
    }
  }

  const handleUpdateManyData = async () => {
    const reqUpdateData: any = {
      email: [],
      dep: [
        {
          depid: '',
          depname: '',
          positionid: '',
          positionname: ''
        }
      ],
      role: 2,
      status: 'Active'
    }

    for (const row of rowData) {
      const rowEmail: any = row.email

      reqUpdateData.email.push(rowEmail)
    }

    reqUpdateData.role = insertData.role
    reqUpdateData.status = insertData.status
    reqUpdateData.dep = userDepData

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/updateMany`, reqUpdateData)

      if (response.data.success) {
        handleClose()
        updateUserList()
      }
    } catch (error: any) {
      console.log('Update users failed. ', error.message)
    }
  }

  const handleUpdateData = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, formData)

      if (response.data.message === 'success') {
        handleClose()
        updateUserList()
      }
    } catch (error: any) {
      console.log('Update user failed. ', error.message)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        {mode == 'insert-one' && <Typography variant='h5'>Add New User</Typography>}
        {mode == 'insert-many' && <Typography variant='h5'>Add New Users</Typography>}
        {mode == 'update-one' && <Typography variant='h5'>Edit User</Typography>}
        {mode == 'update-many' && <Typography variant='h5'>Edit Users</Typography>}
        {mode == 'delete-many' && <Typography variant='h5'>Delete Users</Typography>}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          {(mode == 'insert-one' || mode == 'update-one') && (
            <>
              <Controller
                name='firstname'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    required
                    label='Firstname'
                    placeholder='Enter your firstname'
                    value={formData.firstname}
                    onChange={e => {
                      setFormData({ ...formData, firstname: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.firstname || errorState !== null) && {
                      error: true,
                      helperText: errors?.firstname?.message || errorState?.message[0]
                    })}
                  />
                )}
              />

              <Controller
                name='lastname'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    required
                    label='Lastname'
                    placeholder='Enter your lastname'
                    value={formData.lastname}
                    onChange={e => {
                      setFormData({ ...formData, lastname: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.lastname || errorState !== null) && {
                      error: true,
                      helperText: errors?.lastname?.message || errorState?.message[0]
                    })}
                  />
                )}
              />

              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    required
                    label='Password'
                    placeholder='············'
                    type={isPasswordShown ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => {
                      setFormData({ ...formData, password: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...((errors.password || errorState !== null) && {
                      error: true,
                      helperText: errors?.password?.message || errorState?.message[0]
                    })}
                  />
                )}
              />

              {updateData.email !== '' ? (
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      required
                      label='Email'
                      placeholder='your_email@gmail.com'
                      value={formData.email}
                      onChange={e => {
                        setFormData({ ...formData, email: e.target.value })
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.email || errorState !== null) && {
                        error: true,
                        helperText: errors?.email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              ) : (
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      required
                      label='Email'
                      placeholder='your_email@gmail.com'
                      value={formData.email}
                      onChange={e => {
                        setFormData({ ...formData, email: e.target.value })
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.email || errorState !== null) && {
                        error: true,
                        helperText: errors?.email?.message || errorState?.message[0]
                      })}
                    />
                  )}
                />
              )}

              <div className='flex flex-col'>
                <div className='flex flex-row'>
                  <label className=' text-xs flex-1 '>Department</label>
                  <Chip
                    label='Add'
                    size='small'
                    variant='outlined'
                    className='text-xs'
                    icon={<i className='tabler-square-rounded-plus' />}
                    onClick={handleAddDepOpen}
                  />
                </div>
                <div className='flex gap-4 flex-col'>
                  <List>
                    {userDepData.length > 0 ? (
                      userDepData?.map((dep: any, index: any) => {
                        return (
                          <div key={index}>
                            <ListItem
                              disablePadding
                              secondaryAction={
                                <IconButton
                                  edge='end'
                                  size='small'
                                  onClick={() => handleDeleteDepPosition(`${dep.depid}`, `${dep.positionid}`)}
                                >
                                  <i className='tabler-trash-x' />
                                </IconButton>
                              }
                            >
                              <ListItemButton>
                                <ListItemText primary={`${dep.depname}`} secondary={dep.positionname} />
                              </ListItemButton>
                            </ListItem>
                            <Divider className='m-0' />
                          </div>
                        )
                      })
                    ) : (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText primary={`Department not found`} />
                          </ListItemButton>
                        </ListItem>
                        <Divider className='m-0' />
                        {errorDepartment && (
                          <Typography color='error' className='pt-1'>
                            This field is require department.
                          </Typography>
                        )}
                      </>
                    )}
                  </List>
                </div>
              </div>

              <CustomTextField
                select
                fullWidth
                required
                id='Role'
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: Number(e.target.value) })}
                label='Role'
              >
                {roleData?.map((role: any, index: any) => {
                  return (
                    <MenuItem key={index} value={role.roleid}>
                      {role.rolename}
                    </MenuItem>
                  )
                })}
              </CustomTextField>

              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    required
                    id='select-status'
                    label='Status'
                    value={formData.status}
                    onChange={e => {
                      setFormData({ ...formData, status: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.status || errorState !== null) && {
                      error: true,
                      helperText: errors?.status?.message || errorState?.message[0]
                    })}
                  >
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </CustomTextField>
                )}
              />
            </>
          )}
          {mode == 'insert-many' && (
            <>
              <CustomTextField
                rows={16}
                multiline
                label='Fullname and Email'
                value={insertData.userData}
                placeholder='firstname lastname email, ...'
                onChange={e => setInsertData({ ...insertData, userData: e.target.value })}
              />

              {/* <Controller
                name='insertmany'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    rows={16}
                    multiline
                    value={insertData.userData} // sg today
                    label='Firstname, Lastname, Email'
                    onChange={e => setInsertData({ ...insertData, userData: e.target.value })}
                    {...((errors.insertmany || errorState !== null) && {
                      error: true,
                      helperText: errors?.insertmany?.message || errorState?.message[0]
                    })}
                  />
                )}
              /> */}

              <CustomTextField
                fullWidth
                label='Password'
                placeholder='············'
                type={isPasswordShown ? 'text' : 'password'}
                value={formData.password}
                onChange={e => {
                  setFormData({ ...formData, password: e.target.value })
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Password'
                    placeholder='············'
                    type={isPasswordShown ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => {
                      setFormData({ ...formData, password: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...((errors.password || errorState !== null) && {
                      error: true,
                      helperText: errors?.password?.message || errorState?.message[0]
                    })}
                  />
                )}
              /> */}

              <div className='flex flex-col'>
                <div className='flex flex-row'>
                  <label className=' text-xs flex-1 '>Department</label>
                  <Chip
                    label='Add'
                    size='small'
                    variant='outlined'
                    className='text-xs'
                    icon={<i className='tabler-square-rounded-plus' />}
                    onClick={handleAddDepOpen}
                  />
                </div>
                <div className='flex gap-4 flex-col'>
                  <List>
                    {userDepData.length > 0 && userDepData[0] !== 'null' ? ( // sg here
                      userDepData?.map((dep: any, index: any) => {
                        return (
                          <>
                            <ListItem
                              key={index}
                              disablePadding
                              secondaryAction={
                                <IconButton
                                  edge='end'
                                  size='small'
                                  onClick={() => handleDeleteDepPosition(`${dep.depid}`, `${dep.positionid}`)}
                                >
                                  <i className='tabler-trash-x' />
                                </IconButton>
                              }
                            >
                              <ListItemButton>
                                <ListItemText primary={`${dep.depname}`} secondary={dep.positionname} />
                              </ListItemButton>
                            </ListItem>
                            <Divider className='m-0' />
                          </>
                        )
                      })
                    ) : (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText primary={`Department not found`} />
                          </ListItemButton>
                        </ListItem>
                        <Divider className='m-0' />
                      </>
                    )}
                  </List>
                </div>
              </div>

              <CustomTextField
                select
                fullWidth
                id='Role'
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: Number(e.target.value) })}
                label='Role'
              >
                {roleData?.map((role: any, index: any) => {
                  return (
                    <MenuItem key={index} value={role.roleid}>
                      {role.rolename}
                    </MenuItem>
                  )
                })}
              </CustomTextField>

              <CustomTextField
                select
                fullWidth
                id='select-status'
                label='Status'
                value={formData.status}
                onChange={e => {
                  setFormData({ ...formData, status: e.target.value })
                }}
              >
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>

              {/* <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    id='select-status'
                    label='Status'
                    value={formData.status}
                    onChange={e => {
                      setFormData({ ...formData, status: e.target.value })
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.status || errorState !== null) && {
                      error: true,
                      helperText: errors?.status?.message || errorState?.message[0]
                    })}
                  >
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </CustomTextField>
                )}
              /> */}
            </>
          )}

          {mode == 'update-many' && (
            <>
              <div className='flex flex-col'>
                <label className=' text-xs flex-1 '>User list</label>
                <List>
                  {rowData?.map((row: any, index: any) => {
                    return (
                      <>
                        <ListItem key={index} disablePadding>
                          <ListItemButton>
                            <ListItemText primary={`${row.firstname} ${row.lastname}`} secondary={row.email} />
                          </ListItemButton>
                        </ListItem>
                        <Divider className='m-0' />
                      </>
                    )
                  })}
                </List>
              </div>
              <div className='flex flex-col'>
                <div className='flex flex-row'>
                  <label className=' text-xs flex-1 '>Update Department</label>
                  <Chip
                    label='Add'
                    size='small'
                    variant='outlined'
                    className='text-xs'
                    icon={<i className='tabler-square-rounded-plus' />}
                    onClick={handleAddDepOpen}
                  />
                </div>
                <div className='flex gap-4 flex-col'>
                  <List>
                    {userDepData.length > 0 && userDepData[0] !== 'null' ? ( // sg here
                      userDepData?.map((dep: any, index: any) => {
                        return (
                          <>
                            <ListItem
                              key={index}
                              disablePadding
                              secondaryAction={
                                <IconButton
                                  edge='end'
                                  size='small'
                                  onClick={() => handleDeleteDepPosition(`${dep.depid}`, `${dep.positionid}`)}
                                >
                                  <i className='tabler-trash-x' />
                                </IconButton>
                              }
                            >
                              <ListItemButton>
                                <ListItemText primary={`${dep.depname}`} secondary={dep.positionname} />
                              </ListItemButton>
                            </ListItem>
                            <Divider className='m-0' />
                          </>
                        )
                      })
                    ) : (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText primary={`Department not found`} />
                          </ListItemButton>
                        </ListItem>
                        <Divider className='m-0' />
                      </>
                    )}
                  </List>
                </div>
              </div>

              <CustomTextField
                select
                fullWidth
                id='Role'
                value={insertData.role}
                onChange={e => setInsertData({ ...insertData, role: Number(e.target.value) })}
                label='Role'
              >
                {roleData?.map((role: any, index: any) => {
                  return (
                    <MenuItem key={index} value={role.roleid}>
                      {role.rolename}
                    </MenuItem>
                  )
                })}
              </CustomTextField>

              <CustomTextField
                select
                fullWidth
                id='select-status'
                value={insertData.status}
                onChange={e => setInsertData({ ...insertData, status: e.target.value })}
                label='Status'
              >
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            </>
          )}

          {mode == 'delete-many' && <Typography>Delete many user under construction...</Typography>}

          <div className='flex items-center gap-4'>
            {mode == 'insert-one' && (
              <>
                <Button variant='contained' type='submit'>
                  Submit
                </Button>
              </>
            )}

            {mode == 'insert-many' && ( // <Button variant='contained' onClick={() => handleInsertMany()} type='button'>
              // <Button variant='contained' type='button' onClick={() => handleInsertMany()}>÷
              // <Button variant='contained' type='button' onClick={handleSubmit(handleInsertMany)}>
              <Button variant='contained' type='button' onClick={() => handleInsertMany()}>
                Insert many
              </Button>
            )}
            {mode == 'update-one' && (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Update
              </Button>
            )}
            {mode == 'update-many' && ( // <Button variant='tonal' onClick={() => handleUpdateManyData()}>
              <Button variant='tonal' onClick={() => handleUpdateManyData()}>
                Update
              </Button>
            )}

            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <Dialog
        onClose={handleCloseAddDep}
        aria-labelledby='customized-dialog-title'
        open={openAddDep}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Add Department and Position
          </Typography>
          <DialogCloseButton onClick={handleCloseAddDep} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <CustomTextField
            select
            fullWidth
            id='select-department'
            value={selDep} //onChange={e => setSelectDep(e.target.value)} // sg here
            onChange={e => getPositionDep(e)} // sg here
            label='Department'
            className='mb-4'
          >
            {depData?.map((dep: any, index: any) => {
              return (
                <MenuItem key={index} value={dep.dep}>
                  {dep.depname}
                </MenuItem>
              )
            })}
          </CustomTextField>
          <CustomTextField
            select
            fullWidth
            id='select-positon'
            value={updatePosition} //onChange={e => setSelectDep(e.target.value)} // sg here
            onChange={e => getSelectPostion(e)} // sg here
            label='Position'
            className='mb-4'
          >
            {selPosition?.map((position: any, index: any) => {
              return (
                <MenuItem key={index} value={position.positioncode}>
                  {position.positiondesc}
                </MenuItem>
              )
            })}
          </CustomTextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDep} variant='tonal' color='secondary'>
            Close
          </Button>
          <Button onClick={handleAddDep} variant='contained'>
            Add Department
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  )
}

export default UserDrawerForm
