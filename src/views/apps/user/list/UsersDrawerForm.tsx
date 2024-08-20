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

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

import type { DepType, RoleType, UserFormDataType, UsersType } from '@/types/apps/userTypes'
import { addUserFormSchema } from '@/schemas/formSchema'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

type Props = {
  open: boolean
  updateData: UserFormDataType
  setData: any
  tableData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]
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
  role: 0,
  status: ''
}

const initialInsertData = {
  userData: '',
  password: '',
  role: 0,
  status: '',
  dep: []
}

const UsersDrawerForm = ({ open, setData, updateData, tableData, roleData, depData, handleClose }: Props) => {
  if (updateData.dep.length == 1) {
    if (updateData.dep[0] == 'null') {
      updateData.dep = []
    }
  }

  // let userDepData = updateData.dep

  // States
  const [formData, setFormData] = useState<UserFormDataType>(initialData)
  const [count, setCount] = useState(0)
  const [userDepData, setUserDepData] = useState<any[]>(updateData.dep)
  const [errors, setErrors] = useState<any[]>([])
  const [selDep, setSelectDep] = useState<any>('')
  const [selDepName, setSelectDepName] = useState<any>('')
  const [selPosition, setSelectPosition] = useState<any[]>([])
  const [updatePosition, setUpdatePosition] = useState<any>('')
  const [updatePositionName, setUpdatePositionName] = useState<any>('')
  const [openAddDep, setOpenAddDep] = useState<boolean>(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [insertData, setInsertData] = useState(initialInsertData)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  useEffect(() => {
    setFormData(updateData)
    setUserDepData(updateData.dep)
  }, [open, updateData])

  useEffect(() => {
    //userDepData change ----
    setUserDepData(updateData.dep)
    console.log('use Dep list change to ----')
    console.log(userDepData)
    console.log('count change')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  console.log('use Dep list ----')
  console.log(userDepData)

  const { data: session } = useSession()
  const token = session?.user.token

  const getPositionDep = async (event: any) => {
    const dep = event.target.value

    //const depname = event.explicitOriginalTarget.innerText

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

    // const positionname = event.explicitOriginalTarget.innerText

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)

    try {
      const parsedData = addUserFormSchema.safeParse(formData)

      if (!parsedData.success) {
        const errArr: any[] = []
        const { errors: err } = parsedData.error

        //sg here
        for (let i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message })
          setErrors(errArr)
        }

        setErrors(errArr)

        throw err
      }

      console.log('Form submitted successfully', parsedData.data)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, formData)

      console.log('signup response===', response.data)

      if (response.data.success) {
        console.log('signup success')

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

        setData(tableData)
        handleClose()
      } else {
        console.log('register failed.')
      }
    } catch (error: any) {
      console.log('Add user failed. ', error.message)
    }
  }

  const handleReset = () => {
    // sg today
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
      role: 0,
      status: ''
    })
    setInsertData({
      userData: '',
      password: '',
      role: 0,
      status: '',
      dep: []
    })
  }

  const handleUpdateData = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, formData)

      if (response.data.message === 'success') {
        console.log('Update user success.')
        handleClose()

        const index = tableData?.findIndex(x => x.email == formData.email)

        if (tableData) {
          //const newUpdate = { ...tableData[Number(foundIndex)], formData }
          // tableData[Number(index)].password = formData.password
          //tableData[Number(index)]
          tableData[Number(index)].firstname = formData.firstname
          tableData[Number(index)].lastname = formData.lastname
          tableData[Number(index)].dep = formData.dep
          tableData[Number(index)].position = formData.position
          tableData[Number(index)].role = String(formData.role)
          tableData[Number(index)].status = formData.status
        }

        setData(tableData)
      }
    } catch (error: any) {
      console.log('Update user failed. ', error.message)
    }
  }

  const handleRefresh = () => {
    //router.reload()
    setTimeout(() => {
      window.location.reload()
    }, 100)
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

        console.log('userObj ---')
        console.log(userObj)

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

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/addMany`, insertObj)

      console.log('add users response===', response.data)

      if (response.data.success) {
        console.log('add users success')

        // if (tableData) {
        //   const addData: any = {
        //     depname: formData.depname,
        //     statecode: formData.statecode,
        //     docuname: formData.docuname,
        //     path: formData.path,
        //     sort: formData.sort
        //   }

        //   console.log(addData)

        //   tableData.push(addData)
        // }

        // setData(tableData)
        handleClose()
        handleRefresh()
      } else {
        console.log('add users failed.')
      }
    } catch (error: any) {
      console.log('Add users failed. ', error.message)
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
        {updateData.email !== '' ? (
          <Typography variant='h5'>Edit Multiple User</Typography>
        ) : (
          <Typography variant='h5'>Add Multiple User</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          {/* <CustomTextField
            label='Firstname'
            fullWidth
            placeholder=''
            value={formData.firstname}
            onChange={e => setFormData({ ...formData, firstname: e.target.value })}
          />
          {errors.find(error => error.for === 'firstname')?.message}
          <CustomTextField
            label='Lastname'
            fullWidth
            placeholder='johndoe'
            value={formData.lastname}
            onChange={e => setFormData({ ...formData, lastname: e.target.value })}
          />
          {errors.find(error => error.for === 'lastname')?.message} */}

          <CustomTextField
            rows={16}
            multiline
            value={insertData.userData} // sg today
            label='Firstname, Lastname, Email'
            onChange={e => setInsertData({ ...insertData, userData: e.target.value })}
          />

          <CustomTextField
            fullWidth
            label='Password'
            placeholder='············'
            autoComplete='off'
            type={isPasswordShown ? 'text' : 'password'}
            value={insertData.password}
            onChange={e => setInsertData({ ...insertData, password: e.target.value })}
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
          {errors.find(error => error.for === 'password')?.message}
          {/* {updateData.email !== '' ? (
            <CustomTextField
              label='Email'
              disabled
              fullWidth
              placeholder='your_email@gmail.com'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          ) : (
            <CustomTextField
              label='Email'
              fullWidth
              placeholder='your_email@gmail.com'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          )}
          {errors.find(error => error.for === 'email')?.message} */}

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
            value={insertData.role}
            onChange={e => setInsertData({ ...insertData, role: Number(e.target.value) })}
            label='Role'
          >
            {/* todo */}
            {roleData?.map((role: any) => {
              return (
                <MenuItem key={role.roleid} value={role.roleid}>
                  {role.rolename}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'role')?.message}
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
          {errors.find(error => error.for === 'status')?.message}
          <div className='flex items-center gap-4'>
            {updateData.email !== '' ? (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Edit
              </Button>
            ) : (
              <Button variant='contained' type='button' onClick={() => handleInsertMany()}>
                Submit
              </Button>

              // <Button variant='contained' type='submit'>
              //   Submit
              // </Button>
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
            {depData?.map((dep: any) => {
              return (
                <MenuItem key={dep.dep} value={dep.dep}>
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

export default UsersDrawerForm
