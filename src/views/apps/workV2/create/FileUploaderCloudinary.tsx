// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

//import { async } from '../../../../app/api/work/list/route'

import { useSession } from 'next-auth/react'

// import axios from '@/utils/axios'

//import axios from '@/utils/axios'

type FileProp = {
  name: string
  type: string
  size: number
}

const FileUploaderCloudinary = ({ attmData }: { attmData?: any }) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  const wid = attmData.wid
  const email = attmData.email
  const dep = attmData.dep

  console.log(wid, email, dep)

  const { data: session } = useSession()

  const token = session?.user.token

  console.log(token)

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
    if (!files?.length) return

    const formData = new FormData()

    files.forEach(file => formData.append('file', file))
    formData.append('upload_preset', 'frendsbook')

    const URL: any = process.env.NEXT_PUBLIC_CLOUDINARY_URL

    console.log('URL')
    console.log(URL)

    const data = await fetch(URL, {
      method: 'POST',
      body: formData
    }).then(res => res.json())

    console.log(data)
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
        <i className='tabler-x text-xl' />
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
      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button onClick={() => handleUploadFile()} variant='contained'>
              Upload Files
            </Button>
          </div>
        </>
      ) : null}
    </>
  )
}

export default FileUploaderCloudinary
