'use client'

// MUI Imports
import { useState } from 'react'

// import { redirect } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogContent, DialogTitle, Icon, IconButton } from '@mui/material'

// Type Imports
import axios from 'axios'

// Style Imports
import DialogActions from '@mui/material/DialogActions'

import DialogContentText from '@mui/material/DialogContentText'

import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import FileUploader from './create/FileUploader'

// import FileUploaderCloudinary from './create/FileUploaderCloudinary'

// type DataType = {
//   docType: string
//   docTitle: string
//   imgName: string
//   uploadDate: string
//   uploadBy: string
//   uploadEmail: string
// }

// Vars
// const data: DataType[] = [
//   {
//     docType: 'jpg',
//     docTitle: 'สำเนาบัตรประจำตัวประชาชน',
//     imgName: 'visa',
//     uploadDate: `17 Mar ${new Date().getFullYear()}`,
//     uploadBy: 'Supachai Naowakul',
//     uploadEmail: 'sixthgraph@gmail.com'
//   },
//   {
//     docType: 'pdf',
//     docTitle: 'สำเนาทะเบียนบ้าน',
//     imgName: 'visa',
//     uploadDate: `17 Mar ${new Date().getFullYear()}`,
//     uploadBy: 'Supachai Naowakul',
//     uploadEmail: 'sixthgraph@gmail.com'
//   },
//   {
//     docType: 'xls',
//     docTitle: 'สำเนาทะเบียนบ้าน',
//     imgName: 'visa',
//     uploadDate: `17 Mar ${new Date().getFullYear()}`,
//     uploadBy: 'Supachai Naowakul',
//     uploadEmail: 'sixthgraph@gmail.com'
//   },
//   {
//     docType: 'doc',
//     docTitle: 'หนังสือรับรองรายได้',
//     imgName: 'visa',
//     uploadDate: `17 Mar ${new Date().getFullYear()}`,
//     uploadBy: 'Supachai Naowakul',
//     uploadEmail: 'sixthgraph@gmail.com'
//   }
// ]

const DocumentListTable = ({ docData }: { docData?: any; deletefile?: any }) => {
  console.log('NOON TEST === docData === ')
  console.log(docData.attachment)

  const [open, setOpen] = useState<boolean>(false)
  const [confirm, setConfirm] = useState<boolean>(false)
  const [deletefile, setDeleteFile] = useState({})

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleCloseConfirm = () => setConfirm(false)

  // Hooks
  const { lang: locale } = useParams()

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

  const formatdocType = (data: any) => {
    const type = data.split('.')[1]

    return type
  }

  // Delete
  const handleDeleteFile = async () => {
    console.log('TEST --- wid, itemno ---')

    // const reqBody = {
    //   wid: docData.wid

    //   // itemno: deletefile
    // }

    const reqBody = deletefile

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/delete`, reqBody)

      if (response.data.message === 'success') {
        console.log(response.data.data.detail)
      } else {
        console.error('File delete failed')
      }
    } catch (error: any) {
      console.error('File delete failed', error.message)
    }

    console.log(reqBody)
    console.log(deletefile)
    handleCloseConfirm()
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Documents'
          action={
            <Button onClick={handleClickOpen} variant='contained'>
              Upload
            </Button>
          }
        />
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead className='uppercase'>
              <tr className='border-be'>
                <th className='leading-6 plb-4 pis-6 pli-2' style={{ width: 60 }}></th>
                <th className='leading-6 plb-4 pli-2'>Title</th>
                <th className='leading-6 plb-4 pli-2'>Upload Date</th>
                <th className='leading-6 plb-4 pie-6 pli-2 text-right'>Upload By</th>
                <th className='leading-6 plb-4 pie-6 pli-2 text-right'>Action</th>
              </tr>
            </thead>
            <tbody>
              {docData.attachment.map((row: any, index: any) => (
                <tr key={index} className='border-0'>
                  <td className='pis-6 pli-2 plb-3'>
                    <div className='flex items-center gap-4'>
                      <Icon className={`text-[40px] text-slate-400 tabler-file-type-${formatdocType(row.filename)}`} />
                      {/* <Avatar
                      variant='rounded'
                      className={classnames('is-[50px] bs-[30px]', {
                        // 'bg-white': _mode === 'dark',
                        // 'bg-actionHover': _mode === 'light'
                      })}
                    >
                      <img width={30} alt={row.imgName} src={`/images/logos/${row.imgName}.png`} />
                    </Avatar> */}
                    </div>
                  </td>
                  <td className='pli-2 plb-3'>
                    <div className='flex flex-col'>
                      <Link
                        href={
                          {
                            // pathname: '/en/work'
                            // query: `wid=${row.wid}&wip=${row.original.workinprocessid}&workflowid=${row.original.workflowid}`
                          }
                        }
                      >
                        <Typography color='text.primary'>{row.filename}</Typography>
                      </Link>
                    </div>
                  </td>
                  <td className='pli-2 plb-3'>
                    <Typography variant='body2' color='text.disabled'>
                      {formatshortdate(row.Attachdate)}
                    </Typography>
                  </td>
                  <td className='pli-2 plb-3 pie-6 text-right'>
                    <Typography color='text.primary'>{row.uploadBy}</Typography>
                  </td>
                  <td className='pli-2 plb-3 pie-6 text-right'>
                    <IconButton
                      className='deleteFile'
                      onClick={() => {
                        // handleDeleteFile({ wid: row.wid }, { itemno: row.itemno })
                        setConfirm(true)
                        setDeleteFile({ wid: row.wid, uid: row.uid, dep: row.dep, itemno: row.itemno })
                      }}
                    >
                      <i className='tabler-trash text-[22px] text-textSecondary' />
                    </IconButton>
                    <IconButton onClick={handleClickOpen}>
                      <i className='tabler-paperclip text-[22px] text-textSecondary' />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog
        disableEscapeKeyDown
        aria-labelledby='customized-dialog-title'
        open={open}
        PaperProps={{ sx: { overflow: 'visible' } }}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Upload Files
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <div className='align-middle border-dashed border-2 border-gray-300 min-h-[20rem] min-w-[30rem]'>
            <div className='mt-10 align-middle'>
              <FileUploader attmData={docData} />
              {/* <FileUploaderCloudinary attmData={docData} /> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirm}
        onClose={handleCloseConfirm}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle className='text-center font-size:38px' id='alert-dialog-title'>
          <i className='tabler-alert-circle mbe-2 text-[96px] text-warning' />
          <br></br>
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText className='text-center' id='alert-dialog-description'>
            You will not be able to recover this imaginary file!
          </DialogContentText>
        </DialogContent>
        <DialogActions className='justify-center pbs-5 sm:pbe-10 sm:pli-16'>
          <Button variant='tonal' color='error' onClick={handleCloseConfirm}>
            Cancal
          </Button>
          <Button variant='contained' onClick={handleDeleteFile}>
            Yes, delete it?
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DocumentListTable
