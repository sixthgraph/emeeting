// MUI Imports

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

type Props = {
  open: boolean
  trackingData: any
  handleClose: () => void
}

const TrackingDrawerInfo = ({ open, trackingData, handleClose }: Props) => {
  console.log('tracking data')
  console.log(trackingData)

  // States

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Tracking Info</Typography>
        <IconButton onClick={handleClose}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <Typography>Tracking data here</Typography>
      </div>
    </Drawer>
  )
}

export default TrackingDrawerInfo
