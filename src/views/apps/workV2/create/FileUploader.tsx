// React Imports
import { useState } from 'react'

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
  const wid = attmData.wid
  const email = attmData.email
  const dep = attmData.dep
  const rid = attmData.rid
  const pid = attmData.pid
  const { data: session } = useSession()
  const token = session?.user.token

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
    // sg here
    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
      mode: 'cors'
    }

    for (let i = 0; i < files.length; i++) {
      const form = new FormData()

      form.append('wid', wid)
      form.append('uid', email)
      form.append('dep', dep)
      form.append('rid', rid)
      form.append('pid', pid)
      form.append('refid', '')
      form.append('action', '')
      form.append('filename', '')
      form.append('file', files[i])

      console.log('start upload -----')

      // console.log(files[i])

      const filename = files[i].name

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLOW_API_URL}/createattachment`, {
          method: 'POST',
          body: form,
          headers: headers
        })

        //console.log(form)

        //const response = await axios.post(`${process.env.NEXT_PUBLIC_FLOW_API_URL}/createattachment`, form, { headers })

        if (response) {
          console.log(`Upload ${filename} success!`)
          console.log(response)

          //toast.success(`Upload ${filename} success!`) // sg here
        }
      } catch (error: any) {
        console.log(`Upload ${filename} fails!`)

        //toast.error(`Upload ${filename} false!`)
      }
    }

    handleClose()
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
  }

  const handleEditFile = async () => {
    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
      mode: 'no-cors'
    }

    const form = new FormData()

    form.append('wid', wid)
    form.append('uid', email)
    form.append('dep', dep)
    form.append('rid', rid)
    form.append('pid', pid)
    form.append('id', fileData.itemno)
    form.append('refid', '')
    form.append('action', '')
    form.append('file', files[0])

    const filename = files[0].name

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FLOW_API_URL}/updateattachment?wid=${wid}&uid=${email}&dep=${dep}&id=${fileData.itemno}`,
        {
          method: 'POST',
          body: form,
          headers: headers
        }
      )

      //const response = await axios.post(`${process.env.NEXT_PUBLIC_FLOW_API_URL}/createattachment`, form, { headers })

      //const data = response.json()

      if (response) {
        console.log(`Upload ${filename} success!`)
        console.log(response)

        //toast.success(`Upload ${filename} success!`) // sg here
      }

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
