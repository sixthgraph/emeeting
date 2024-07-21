'use client'

// MUI Imports
import { useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { Button, Dialog, DialogContent, DialogTitle, Icon } from '@mui/material'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import FileUploader from './create/FileUploader'

type DataType = {
  docType: string
  docTitle: string
  imgName: string
  uploadDate: string
  uploadBy: string
  uploadEmail: string
}

// Vars
const data: DataType[] = [
  {
    docType: 'jpg',
    docTitle: 'สำเนาบัตรประจำตัวประชาชน',
    imgName: 'visa',
    uploadDate: `17 Mar ${new Date().getFullYear()}`,
    uploadBy: 'Supachai Naowakul',
    uploadEmail: 'sixthgraph@gmail.com'
  },
  {
    docType: 'pdf',
    docTitle: 'สำเนาทะเบียนบ้าน',
    imgName: 'visa',
    uploadDate: `17 Mar ${new Date().getFullYear()}`,
    uploadBy: 'Supachai Naowakul',
    uploadEmail: 'sixthgraph@gmail.com'
  },
  {
    docType: 'xls',
    docTitle: 'สำเนาทะเบียนบ้าน',
    imgName: 'visa',
    uploadDate: `17 Mar ${new Date().getFullYear()}`,
    uploadBy: 'Supachai Naowakul',
    uploadEmail: 'sixthgraph@gmail.com'
  },
  {
    docType: 'doc',
    docTitle: 'หนังสือรับรองรายได้',
    imgName: 'visa',
    uploadDate: `17 Mar ${new Date().getFullYear()}`,
    uploadBy: 'Supachai Naowakul',
    uploadEmail: 'sixthgraph@gmail.com'
  }
]

const DocumentListTable = () => {
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className='border-0'>
                  <td className='pis-6 pli-2 plb-3'>
                    <div className='flex items-center gap-4'>
                      <Icon className={`text-[40px] text-slate-400 tabler-file-type-${row.docType}`} />
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
                      <Typography color='text.primary'>{row.docTitle}</Typography>
                    </div>
                  </td>
                  <td className='pli-2 plb-3'>
                    <Typography variant='body2' color='text.disabled'>
                      {row.uploadDate}
                    </Typography>
                  </td>
                  <td className='pli-2 plb-3 pie-6 text-right'>
                    <Typography color='text.primary'>{row.uploadBy}</Typography>
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
              <FileUploader />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DocumentListTable
