'use client'

// MUI Imports
import { useEffect, useState } from 'react'

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
import { useSession } from 'next-auth/react'

// Style Imports
import DialogActions from '@mui/material/DialogActions'

import DialogContentText from '@mui/material/DialogContentText'

import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import FileUploader from './create/FileUploader'
import ReqFileUploader from './create/ReqFileUploader'

// import FileUploaderCloudinary from './create/FileUploaderCloudinary'

const DocumentListTable = ({ documentList, docData }: { documentList?: any; docData?: any }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [confirm, setConfirm] = useState<boolean>(false)
  const [reqUploadOpen, setReqUploadOpen] = useState<boolean>(false)
  const [reqUploadData, setReqUploadData] = useState<any>()
  const [deletefile, setDeleteFile] = useState({})
  const [editfile, setEditFile] = useState({})
  let attData = docData?.attachment
  const [attachmentList, setAttachmentList] = useState<any>(attData)
  const { data: session } = useSession()
  const token = session?.user.token

  useEffect(() => {
    if (!open) {
      handleGetDocument().then(resData => {
        mapDocument(resData)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClickOpen = () => setOpen(true)

  const handleReqUploadOpen = (data: any) => {
    setReqUploadData(data)
    setReqUploadOpen(true)
    setOpen(true)
  }

  const handleClose = () => {
    console.log('handleClose start')
    setOpen(false)
    setReqUploadOpen(false)
  }

  const handleCloseConfirm = () => setConfirm(false)

  const mapDocument = async (resData: any) => {
    for (const item of documentList) {
      const findRefId = attData.find((elem: any) => elem.refid === item._id)

      if (!findRefId) {
        const newData = {
          allowupdate: 'Y',
          attachdate: '',
          attachname: '',
          dep: '',
          filename: item.document_name,
          linkwid: '-',
          uid: '',
          wid: '',
          refid: item._id,
          action: item.action,
          format: item.format,
          size: item.size
        }

        resData.push(newData)
      }
    }

    setAttachmentList(resData)
    attData = resData
  }

  const handleGetDocument = async () => {
    console.log('handleGetDocument --- start')

    // sg here
    const reqBody = {
      wid: docData.wid,
      itemno: '',
      token: token
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/list`, reqBody)

      let resData = response.data.data

      if (!resData) {
        resData = []
      }

      return resData
    } catch (error: any) {
      console.log('Editwork failed. ', error.message)
    }
  }

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
    const typeObj = data.split('.')
    const l = typeObj.length
    const type = typeObj[l - 1]

    return type
  }

  // Delete
  const handleDeleteFile = async () => {
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

    handleCloseConfirm() // sg here
    handleGetDocument().then(resData => {
      mapDocument(resData)
    })
  }

  const handleReset = () => {
    handleClose()
    setEditFile({})
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
              {attachmentList.length > 0 ? (
                attachmentList?.map((row: any, index: any) => (
                  <tr key={index} className='border-0'>
                    <td className='pis-6 pli-2 plb-3'>
                      <div className='flex items-center gap-4'>
                        {row.wid !== '' ? (
                          <Icon
                            className={`text-[40px] text-slate-400 tabler-file-type-${formatdocType(row.attachname)}`}
                          />
                        ) : (
                          <Icon className={`text-[40px] text-slate-400 tabler-file-alert`} />
                        )}
                      </div>
                    </td>
                    <td className='pli-2 plb-3'>
                      <div className='flex flex-col'>
                        {row.wid !== '' ? (
                          <Link
                            target='_blank'
                            href={'https://rd.infoma.net' + row.attachname.replace('D:\\routeflow', '\\routefile')}
                          >
                            <Typography color='text.primary'>{row.filename}</Typography>
                          </Link>
                        ) : (
                          <>
                            <Typography color='text.primary'>{row.filename}</Typography>
                            <Typography variant='body2'>* กรุณาแนบ{row.filename}</Typography>
                            <Typography variant='body2'>
                              รองรับไฟล์ {row.format} ขนาดไม่เกิน {row.size}MB
                            </Typography>
                          </>
                        )}
                      </div>
                    </td>
                    <td className='pli-2 plb-3'>
                      {row.wid !== '' ? (
                        <Typography variant='body2' color='text.disabled'>
                          {formatshortdate(row.attachdate)}
                        </Typography>
                      ) : (
                        <Typography variant='body2' color='text.disabled'>
                          -
                        </Typography>
                      )}
                    </td>
                    <td className='pli-2 plb-3 pie-6 text-right'>
                      <Typography color='text.primary'>{row.uid}</Typography>
                    </td>
                    <td className='pli-2 plb-3 pie-6 text-right'>
                      {row.wid !== '' ? (
                        <>
                          <IconButton
                            className='deleteFile'
                            onClick={() => {
                              // handleDeleteFile({ wid: row.wid }, { itemno: row.itemno })
                              setConfirm(true)
                              setDeleteFile({
                                wid: row.wid,
                                uid: row.uid,
                                dep: row.dep,
                                itemno: row.itemno,
                                rid: docData.rid,
                                pid: docData.pid
                              })
                            }}
                          >
                            <i className='tabler-trash text-[22px] text-textSecondary' />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              // handleEditFile()
                              handleClickOpen()
                              setEditFile({ filename: row.filename, dep: row.dep, itemno: row.itemno, btype: 'edit' })
                            }}
                          >
                            <i className='tabler-paperclip text-[22px] text-textSecondary' />
                          </IconButton>
                        </>
                      ) : (
                        <Button onClick={() => handleReqUploadOpen(row)} color='error' variant='outlined' size='small'>
                          {row.action}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='text-center'>
                    Document not found.
                  </td>
                </tr>
              )}
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
          <DialogCloseButton onClick={handleReset} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <div className='align-middle border-dashed border-2 border-gray-300 min-h-[20rem] min-w-[30rem]'>
            <div className='mt-10 align-middle'>
              {reqUploadOpen ? (
                <ReqFileUploader reqDocData={reqUploadData} handleClose={() => setOpen(!open)} attmData={docData} />
              ) : (
                <FileUploader handleClose={() => setOpen(!open)} attmData={docData} fileData={editfile} />
              )}
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
