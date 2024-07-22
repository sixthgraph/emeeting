'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

type EditUserInfoData = {
  name?: string
  firstName?: string
  lastName?: string
  userName?: string
  billingEmail?: string
  status?: string
  taxId?: string
  contact?: string
  language?: string[]
  country?: string
  useAsBillingAddress?: boolean
}

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: EditUserInfoData
}

const initialData: EditUserInfoProps['data'] = {
  name: '',
  firstName: '',
  lastName: '',
  userName: '',
  billingEmail: '',
  status: 'active',

  // taxId: 'Tax-8894',
  contact: '',
  language: ['English'],
  country: 'TH',
  useAsBillingAddress: true
}

const status = ['Status', 'Active', 'Inactive', 'Suspended']

const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

const countries = ['Select Country', 'France', 'Russia', 'China', 'UK', 'US']

const EditUserInfo = ({ open, setOpen, data }: EditUserInfoProps) => {
  // States
  const [userData, setUserData] = useState<EditUserInfoProps['data']>(data || initialData)

  const handleClose = () => {
    setOpen(false)
    setUserData(initialData)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit User Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating user details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={e => e.preventDefault()}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='First Name'
                placeholder=''
                value={''}
                onChange={e => setUserData({ ...userData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Last Name'
                placeholder=''
                value={''}
                onChange={e => setUserData({ ...userData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='User Name'
                placeholder=''
                value={userData?.userName}
                onChange={e => setUserData({ ...userData, userName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                placeholder=''
                value={userData?.billingEmail}
                onChange={e => setUserData({ ...userData, billingEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                value={userData?.status}
                onChange={e => setUserData({ ...userData, status: e.target.value as string })}
              >
                {status.map((status, index) => (
                  <MenuItem key={index} value={index === 0 ? '' : status.toLowerCase().replace(/\s+/g, '-')}>
                    {status}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Tax ID'
                placeholder='Tax-7490'
                value={userData?.taxId}
                onChange={e => setUserData({ ...userData, taxId: e.target.value })}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Contact'
                placeholder=''
                value={userData?.contact}
                onChange={e => setUserData({ ...userData, contact: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Language'
                value={userData?.language?.map(lang => lang.toLowerCase().replace(/\s+/g, '-')) || []}
                SelectProps={{
                  multiple: true,
                  onChange: e => setUserData({ ...userData, language: e.target.value as string[] }),
                  renderValue: selected => (
                    <div className='flex items-center gap-2'>
                      {(selected as string[]).map(value => (
                        <Chip key={value} label={value} className='capitalize' size='small' />
                      ))}
                    </div>
                  )
                }}
              >
                {languages.map((language, index) => (
                  <MenuItem key={index} value={language.toLowerCase().replace(/\s+/g, '-')}>
                    {language}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Country'
                value={userData?.country?.toLowerCase().replace(/\s+/g, '-')}
                onChange={e => setUserData({ ...userData, country: e.target.value as string })}
              >
                {countries.map((country, index) => (
                  <MenuItem key={index} value={index === 0 ? '' : country.toLowerCase().replace(/\s+/g, '-')}>
                    {country}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked={userData?.useAsBillingAddress} />}
                label='Use as a billing address?'
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleClose} type='submit'>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditUserInfo
