import { Chip, Divider, IconButton, InputAdornment } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import CustomTextField from '@/@core/components/mui/TextField'

const getAvatar = (params: Pick<any, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={45} variant='rounded' />
  } else {
    return (
      <CustomAvatar size={45} variant='rounded'>
        {getInitials(fullName as string)}
      </CustomAvatar>
    )
  }
}

const handleClick = () => {
  console.info('You clicked the Chip.')
}

const WorkMessage = () => {
  return (
    <>
      <div className='flex flex-col mb-3'>
        <div className='flex flex-row '>
          <div className='flex  me-5'>
            {getAvatar({
              avatar: '/images/avatars/300-21.jpg',
              fullName: 'Carles Nilson'
            })}
          </div>
          <div className='flex flex-col flex-1 '>
            <a href='#' className='font-semibold text-slate-900'>
              Carles Nilson
            </a>
            <span className='text-sm'>Yestarday at 5:06 PM</span>
          </div>
        </div>
      </div>

      <div className='text-slate-600 text-sm mb-4'>
        Outlines keep you honest. They stop you from indulging in poorly thought-out metaphors about driving and keep
        you focused on the overall structure of your post
      </div>

      <div className='mb-4'>
        <Chip
          label='reply'
          size='small'
          className='mr-2'
          icon={<i className='tabler-message' />}
          onClick={handleClick}
        />
        <Chip label='150' size='small' icon={<i className='tabler-heart' />} onClick={handleClick} />
      </div>

      <div className='flex flex-row mb-7 ps-10'>
        <div className=' me-5'>
          {getAvatar({
            avatar: '/images/avatars/300-14.jpg',
            fullName: 'Carles Nilson'
          })}
        </div>
        <div className='flex flex-col '>
          <div className='flex flex-row align-items-center flex-wrap mb-1'>
            <div className='flex-1'>
              <a href='#' className='font-semibold text-slate-900 me-2'>
                Alice Danchik
              </a>
              <span className='text-gray-400 text-sm'>1 day</span>
            </div>

            <div className='flex flex-none text-gray-400 text-sm'>
              <a href='#' className='ms-auto text-gray-400  fs-7 me-2'>
                Reply
              </a>
              <a href='#' className='btn btn-sm btn-icon btn-clear btn-active-light-danger' title='Love'>
                <span className='m-0'>
                  <i className='tabler-heart-filled text-lg' />
                </span>
              </a>
            </div>
          </div>

          <span className='text-slate-600 text-sm pt-1'>
            Long before you sit dow to put digital pen to paper you need to make sure you have to sit down and write.
          </span>
        </div>
      </div>

      <div className='flex flex-row mb-7 ps-10'>
        <div className='symbol symbol-45px me-5'>
          {getAvatar({
            avatar: '/images/avatars/300-9.jpg',
            fullName: 'Carles Nilson'
          })}
        </div>

        <div className='flex flex-col '>
          <div className='flex flex-row align-items-center flex-wrap mb-1'>
            <div className='flex-1'>
              <a href='#' className='font-semibold text-slate-900 me-2'>
                Harris Bold
              </a>
              <span className='text-gray-400 text-sm'>2 days</span>
            </div>

            <div className='flex flex-none text-gray-400 text-sm'>
              <a href='#' className='ms-auto text-gray-400  fs-7 me-2'>
                Reply
              </a>
              <a href='#' className='btn btn-sm btn-icon btn-clear btn-active-light-danger' title='Love'>
                <span className='m-0'>
                  <i className='tabler-heart-filled text-lg' />
                </span>
              </a>
            </div>
          </div>
          <span className='text-gray-800 fs-7 fw-normal pt-1'>
            Outlines keep you honest. They stop you from indulging in poorly
          </span>
        </div>
      </div>
      <Divider className='mb-3' />
      <div className='flex flex-col mb-3'>
        <div className='flex flex-row '>
          <div className='flex  me-5'>
            {getAvatar({
              avatar: '/images/avatars/300-5.jpg',
              fullName: 'Carles Nilson'
            })}
          </div>
          <div className='flex flex-col flex-1 '>
            <a href='#' className='font-semibold text-slate-900'>
              Carles Nilson
            </a>
            <span className='text-sm'>Yestarday at 5:06 PM</span>
          </div>
        </div>
      </div>

      <div className='text-slate-600 text-sm mb-4'>
        Outlines keep you honest. They stop you from indulging in poorly thought-out metaphors about driving and keep
        you focused on the overall structure of your post
      </div>
      <div className='mb-5'>
        <Chip
          label='reply'
          size='small'
          className='mr-2'
          icon={<i className='tabler-message' />}
          onClick={handleClick}
        />
        <Chip label='150' size='small' icon={<i className='tabler-heart' />} onClick={handleClick} />
      </div>
      <Divider className='mb-3' />

      <CustomTextField
        id='message-input'
        fullWidth
        placeholder='Type a message..'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton edge='end' onMouseDown={e => e.preventDefault()} aria-label='toggle password visibility'>
                <i className={'tabler-paperclip'} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </>
  )
}

export default WorkMessage
