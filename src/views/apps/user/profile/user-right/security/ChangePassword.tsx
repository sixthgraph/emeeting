'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

// Component Imports
import { useSession } from 'next-auth/react'

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import axios from '@/utils/axios'

const ChangePassword = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [enableButton, setEnableButton] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [openAlert, setOpenAlert] = useState<boolean>(false)

  const { data: session } = useSession()

  // Vars
  const name = session?.user.name
  const email = session?.user.email
  const role: any = session?.user.role
  const userAvatar: any = session?.user.avatar
  const userDep: any = session?.user.dep
  const nameObj: any = name?.split(' ')

  //const roles = ['Admin', 'Worker', 'Viewer', 'Super User']
  //const userFullname: any = session?.user.name
  //const userRole = roles[role - 1]

  let firstname: any = ''
  let lastname: any = ''

  if (nameObj) {
    firstname = nameObj[0]
    lastname = nameObj[1]
  }

  const data = {
    name: name,
    firstname: firstname,
    lastname: lastname,
    fullName: name,
    email: email,
    password: '',
    avatar: userAvatar,
    avatarcolor: '',
    dep: userDep,
    position: '',
    status: 'active',
    role: role
  }

  const [userData, setUserData] = useState<any>(data)

  const handleClose = () => {
    setOpenAlert(false)
  }

  setTimeout(() => {
    const pw = document.getElementById('Password') as HTMLInputElement

    pw.value = ''
  }, 100)

  const handleUpdateData = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, userData)

      if (response.data.message === 'success') {
        setOpenAlert(true)
        setUserData(data)
        setConfirmPassword('')
      }
    } catch (error: any) {
      console.log('Update user failed. ', error.message)
    }
  }

  const checkPasswordMatch = (val: any) => {
    setConfirmPassword(val)

    if (val == userData.password) {
      setEnableButton(true)
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Change Password' />
        <CardContent className='flex flex-col gap-4'>
          <Alert icon={false} severity='warning' onClose={() => {}}>
            <AlertTitle>Ensure that these requirements are met</AlertTitle>
            Minimum 8 characters long, uppercase & symbol
          </Alert>
          <form autoComplete='off'>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Password'
                  id='Password'
                  type={isPasswordShown ? 'text' : 'password'}
                  value={userData?.password}
                  autoComplete='off'
                  onChange={e => setUserData({ ...userData, password: e.target.value as string })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsPasswordShown(!isPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Confirm Password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  value={confirmPassword}
                  autoComplete='off'
                  onChange={e => checkPasswordMatch(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} className='flex gap-4'>
                {enableButton ? (
                  <Button variant='contained' onClick={handleUpdateData}>
                    Change Password
                  </Button>
                ) : (
                  <Button variant='contained' disabled>
                    Change Password
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Dialog
        open={openAlert}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Update password success.</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You can use the new password on your next login.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChangePassword
