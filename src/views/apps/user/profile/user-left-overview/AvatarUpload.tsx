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

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { useSession } from 'next-auth/react'

type FileProp = {
  name: string
  type: string
  size: number
}

const AvatarUploader = ({ handleClose }: { handleClose: () => void }) => {
  // States
  const [files, setFiles] = useState<File[]>([])
  const { data: session } = useSession()
  const token = session?.user.token
  const email: any = session?.user.email

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg']
    },
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
    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`
    }

    const form = new FormData()

    form.append('id', email)
    form.append('file', files[0])

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLOW_API_URL}/createavatar`, {
        method: 'POST',
        body: form,
        headers: headers
      })

      if (response) {
        console.log('createavatar success')
      }

      handleClose()
    } catch (error: any) {
      console.log('createavatar from client call failed. ', error.message)
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
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
          <Typography>(1 files are the maximum number of files you can drop here.)</Typography>
          <Typography>(Support file format (*.png, *.jpg, *.jpeg))</Typography>
        </div>
      </div>

      <List>{fileList}</List>
      <DialogActions className='buttons justify-end'>
        <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
          Remove All
        </Button>
        <Button onClick={() => handleUploadFile()} variant='contained'>
          Upload Files
        </Button>
      </DialogActions>
    </>
  )
}

export default AvatarUploader
