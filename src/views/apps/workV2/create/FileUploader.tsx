// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'

// import axios from 'axios'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

//import { async } from '../../../../app/api/work/list/route'

import { useSession } from 'next-auth/react'

// import axios from '@/utils/axios'

type FileProp = {
  name: string
  type: string
  size: number
}

const FileUploader = ({
  attmData,
  fileData,
  handleClose
}: {
  attmData?: any
  fileData?: any
  handleClose: () => void
}) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  //const [base64, setBase64] = useState<string | null>(null)

  const wid = attmData.wid
  const email = attmData.email
  const dep = attmData.dep
  const rid = attmData.rid
  const pid = attmData.pid

  const { data: session } = useSession()

  const token = session?.user.token

  //const [open, setOpen] = useState<boolean>(false)
  // const handleClose = () => setOpen(false)

  // console.log(open)

  // console.log(token)

  useEffect(() => {
    console.log('files ----')
    console.log(files)
  }, [files])

  // Hooks
  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: (acceptedFiles: File[]) => {
  //     setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
  //   }
  // })
  // if (fileData.filename == undefined) {
  //   console.log('ว่าง')
  // } else {
  //   console.log('ไม่ว่าง')
  // }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      // setFiles(acceptedFiles.map((file: File) => Object.assign(file)))

      if (acceptedFiles?.length) {
        setFiles(previousFiles => [
          ...previousFiles,
          ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
        ])
      }
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleUploadFile = async () => {
    console.log('--attmData--')
    console.log(wid)
    console.log(email)

    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`

      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

      // 'Content-Type': 'multipart/form-data'
    }

    const form = new FormData()

    form.append('wid', wid)
    form.append('uid', email)
    form.append('dep', dep)
    form.append('rid', rid)
    form.append('pid', pid)

    //form.append('my_buffer', new Blob([1, 2, 3]))
    form.append('file', files[0])

    console.log('----form body createattachment from client call------')
    console.log(form)

    try {
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/add`, form)
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/add`, form)

      const response = await fetch(`${process.env.NEXT_PUBLIC_FLOW_API_URL}/createattachment`, {
        method: 'POST',
        body: form,
        headers: headers

        // mode: 'no-cors'
      })

      console.log('response createattachment from client call------')
      console.log(response)

      // if (response.data.message === 'success') {
      //   console.log('---createattachment from client call success.------------------')
      // } else {
      //   console.log(response.data.message)
      // }
      handleClose()
    } catch (error: any) {
      console.log('createattachment from client call failed. ', error.message)
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  // const toBase64 = (file: File) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader()

  //     fileReader.readAsDataURL(file)

  //     fileReader.onload = () => {
  //       resolve(fileReader.result)
  //     }

  //     fileReader.onerror = error => {
  //       reject(error)
  //     }
  //   })
  // }

  // const handleSignPdf = async () => {
  //   const form = new FormData()

  //   const base64 = await toBase64(files[0] as File)

  //   setBase64(base64 as string)

  //   const reqBody: any = {
  //     unsignedPdf: base64, //base64,
  //     uid: 'chulapak',
  //     pwd: 'infoma',
  //     x0: '100',
  //     y0: '100',
  //     imageWidth: '100',
  //     imageHeight: '70',
  //     pageNumber: '0'
  //   }
  //   const headers = {
  //     Accept: '*/*',
  //     Authorization: `Bearer ${token}`
  //   }

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attachment/sign`, {
  //       method: 'post',
  //       headers: headers,
  //       body: JSON.stringify(reqBody)
  //     })

  //     console.log('response attachment/sign ------')

  //     const data = response

  //     console.log('----- DATA -----')
  //     console.log(data)
  //   } catch (err: any) {
  //     console.log('----- error -----')
  //     console.log(err.message)
  //   }
  // }

  const handleEditFile = async () => {
    console.log('--attmData--')

    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`
    }

    // console.log(attmData)
    const form = new FormData()

    form.append('wid', wid)
    form.append('uid', email)
    form.append('dep', dep)
    form.append('rid', rid)
    form.append('pid', pid)
    form.append('id', fileData.itemno)
    form.append('file', files[0])

    // const updateData: any = {
    //   wid: wid,
    //   uid: email,
    //   dep: dep,
    //   itemno: fileData.itemno,
    //   file: files[0]
    // }

    console.log('----form body updateattachment from client call------')
    console.log(form)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FLOW_API_URL}/updateattachment?wid=${wid}&uid=${email}&dep=${dep}&id=${fileData.itemno}`,
        {
          method: 'POST',
          body: form,
          headers: headers
        }
      )

      console.log('response updateattachment from client call------')
      const data = response.json()

      console.log('----- DATA -----')
      console.log(data)

      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/update`, form)

      // if (response.data.message === 'success') {
      //   console.log('Update user success.')
      // }
      handleClose()
    } catch (error: any) {
      console.log('update from client call failed. ', error.message)
    }
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl text-right' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='flex items-center flex-col'>
          <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h4' className='mbe-2.5'>
            Drop files here or click to upload.
          </Typography>
          <Typography>
            Drop files here or click{' '}
            <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
              browse
            </a>{' '}
            thorough your machine
          </Typography>
        </div>
      </div>

      {files.length >= 1 && fileData.btype === undefined ? (
        <>
          <List>{fileList}</List>
          <DialogActions className='buttons justify-end'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button onClick={() => handleUploadFile()} variant='contained'>
              Upload Files
            </Button>
            {/* <Button onClick={() => handleSignPdf()} variant='contained'>
              Digital Sign
            </Button> */}
          </DialogActions>
        </>
      ) : null}

      {files.length == 1 && fileData.btype === 'edit' ? (
        <>
          <List>{fileList}</List>
          <DialogActions className='buttons justify-end'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button onClick={() => handleEditFile()} variant='contained'>
              Edit Files
            </Button>
          </DialogActions>
        </>
      ) : null}
    </>
  )
}

export default FileUploader
