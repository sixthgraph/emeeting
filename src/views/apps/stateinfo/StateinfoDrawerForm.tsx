// React Imports
import { useEffect, useState } from 'react'

//import { useParams, useSearchParams } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports

//import type { SubmitHandler } from 'react-hook-form'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { Input } from 'valibot'

import axios from 'axios'

// import { any } from 'zod'

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

import type { StateinfosType } from '@/types/apps/stateinfoTypes'

import { stateinfoFormSchema } from '@/schemas/stateinfoSchema'

type FormData = Input<typeof stateinfoFormSchema>

type ErrorType = {
  message: string[]
}

// Util Imports
//import { getLocalizedUrl } from '@/utils/i18n'
//import type { Locale } from '@/configs/i18n'

type Props = {
  open: boolean
  updateData: any
  setData: any
  tableData?: StateinfosType[]
  handleClose: () => void
  updateStateInfoList: any
  curMaxState: any
}

//type FormData = Input<typeof StateinfoFormSchema>

// type ErrorType = {
//   message: string[]
// }

// Vars
const initialData = {
  statecode: '',
  desc: '',
  ref: '',
  remark: '',
  create_date: '',
  create_by: '',
  update_date: '',
  update_by: ''
}

const StateinfoDrawerForm = ({
  open,
  setData,
  updateData,
  tableData,
  handleClose,
  updateStateInfoList,
  curMaxState
}: Props) => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const { data: session } = useSession()
  const emailData = session?.user.email

  //HOOK
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(stateinfoFormSchema),
    defaultValues: {
      desc: ''
    }
  })

  console.log('setData')
  console.log(setData)
  console.log('tableData')
  console.log(tableData)

  // const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
  //   try {
  //     const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stateinfos/add`, {
  //       statecode: data.statecode,
  //       desc: data.desc,
  //       redirect: false
  //     })

  //     if (res && res.data.success) {
  //       const redirectURL = searchParams.get('redirectTo') ?? '/stateinfo'

  //       router.push(getLocalizedUrl(redirectURL, locale as Locale))
  //     }
  //   } catch (error: any) {
  //     // console.log('error === ', error)

  //     if (error) {
  //       //setErrorState(error.response.data)
  //       console.log(error.response.data.error)
  //       setSignupStatus(error.response.data.error)
  //     }
  //   }
  // }

  // const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   setFormData(initialData)

  //   //Add
  //   try {
  //     formData.create_by = String(emailData)
  //     formData.update_by = String(emailData)

  //     //====const parsedData = StateinfoFormSchema.safeParse(formData)

  //     // if (!parsedData.success) {
  //     //   const errArr: any[] = []
  //     //   const { errors: err } = parsedData.error

  //     //   //sg here
  //     //   for (let i = 0; i < err.length; i++) {
  //     //     errArr.push({ for: err[i].path[0], message: err[i].message })
  //     //     setErrors(errArr)
  //     //   }

  //     //   setErrors(errArr)

  //     //   throw err
  //     // }

  //     // console.log('Form submitted successfully', parsedData.data)
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stateinfos/add`, formData)

  //     console.log('Add response===', response.data)

  //     if (response.data.success) {
  //       console.log('Add success')

  //       if (tableData) {
  //         const addData: any = {
  //           statecode: formData.statecode,
  //           desc: formData.desc,
  //           ref: formData.ref,
  //           remark: formData.remark,
  //           create_date: '',
  //           create_by: emailData,
  //           update_date: '',
  //           update_by: emailData
  //         }

  //         console.log('add ====' + emailData)

  //         console.log(addData)

  //         //tableData.push(addData)
  //         tableData.push(addData)
  //       }

  //       console.log(tableData)

  //       setData(tableData)
  //       handleClose()
  //       handleRefresh()
  //     } else {
  //       console.log('add failed.')
  //     }
  //   } catch (error: any) {
  //     console.log('Add stateinfo failed. ', error.message)
  //   }
  // }

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<FormData>({
  //   resolver: valibotResolver(StateinfoFormSchema),
  //   defaultValues: {
  //     statecode: '',
  //     desc: ''
  //   }
  // })

  const onSubmit = async () => {
    setFormData(initialData)

    //Add
    try {
      formData.create_by = String(emailData)
      formData.update_by = String(emailData)

      // console.log('Form submitted successfully', parsedData.data)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stateinfos/add`, formData)

      console.log('Add response===', response.data)

      if (response.data.success) {
        console.log('Add success')
        updateStateInfoList()
        handleClose()
      } else {
        console.log('add failed.')
      }
    } catch (error: any) {
      console.log('Add stateinfo failed. ', error.message)
    }
  }

  //Reset
  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  //Update
  const handleUpdateData = async () => {
    try {
      formData.update_by = String(emailData)

      const response = await axios.post('/api/stateinfos/update', formData)

      console.log('stateinfo formdate=====')
      console.log(formData)
      console.log(response.data)

      if (response.data.message === 'success') {
        console.log('Update stateinfo success.')
        updateStateInfoList()
        handleClose()
      }
    } catch (error: any) {
      console.log('Update stateinfo failed. ', error.message)
    }
  }

  useEffect(() => {
    setFormData(updateData)

    if (open) {
      clearErrors()
    }
  }, [open, updateData])

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
        {updateData.statecode !== '' ? (
          <Typography variant='h5'>Edit Stateinfo</Typography>
        ) : (
          <Typography variant='h5'>Add New Stateinfo</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Statecode'
            disabled
            fullWidth
            placeholder=''
            value={formData.statecode}
            onChange={e => setFormData({ ...formData, statecode: e.target.value })}
          />
          {updateData.statecode !== '' ? (
            <Controller
              name='desc'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  required
                  label='Desc'
                  placeholder='Enter Desc Name'
                  value={formData.desc}
                  onChange={e => {
                    setFormData({ ...formData, desc: e.target.value })
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.desc || errorState !== null) && {
                    error: true,
                    helperText: errors?.desc?.message || errorState?.message[0]
                  })}
                />
              )}
            />
          ) : (
            <Controller
              name='desc'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  required
                  label='Desc'
                  placeholder='Enter Desc Name'
                  value={formData.desc}
                  onChange={e => {
                    setFormData({ ...formData, desc: e.target.value, statecode: curMaxState })
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.desc || errorState !== null) && {
                    error: true,
                    helperText: errors?.desc?.message || errorState?.message[0]
                  })}
                />
              )}
            />
          )}

          <CustomTextField
            label='Ref'
            fullWidth
            placeholder=''
            value={formData.ref}
            onChange={e => setFormData({ ...formData, ref: e.target.value })}
          />

          <CustomTextField
            label='Remark'
            fullWidth
            placeholder=''
            value={formData.remark}
            onChange={e => setFormData({ ...formData, remark: e.target.value })}
          />

          <div className='flex items-center gap-4'>
            {updateData.statecode !== '' ? (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Update
              </Button>
            ) : (
              <Button variant='contained' type='submit'>
                Submit
              </Button>
            )}

            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default StateinfoDrawerForm
