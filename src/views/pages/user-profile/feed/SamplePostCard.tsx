import { useState } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Avatar, Button, CardActions, Collapse, Divider, Grid, IconButton } from '@mui/material'

const SamplePostCard = () => {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardMedia image={`${process.env.NEXT_PUBLIC_BASEPATH}/images/posts/5.png`} className='bs-[180px]' />
          <CardContent className='relative'>
            <Avatar
              src='https://rd.infoma.net/routefile/userdisplay/663185f9db3fa50eafc889ad/b16b1e7a-34da-4d12-b814-5fba08826154.jpg'
              alt='Robert Meyer'
              className='is-[78px] bs-[78px] border-[5px] border-backgroundPaper absolute start-[11px] block-start-[-39px]'
            />
            <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2 mbe-5 mbs-[30px]'>
              <div className='flex flex-col items-start'>
                <Typography variant='h5'>Supachai Naowakul</Typography>
                <Typography variant='body2'>Resarch & Development / Frontend Developer</Typography>
              </div>
              <Button variant='contained' onClick={() => router.push('/en/users/profile/webmaster@excelink.co.th')}>
                View profile
              </Button>
            </div>
            <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2'>
              <Typography variant='h5' className='mbe-2'>
                Influencing The Influencer
              </Typography>
              <Typography color='text.secondary'>
                Cancun is back, better than ever! Over a hundred Mexico resorts have reopened and the state tourism
                minister predicts Cancun will draw as many visitors in 2006 as it did two years ago.
              </Typography>
            </div>
            <Divider className='mbs-7 mbe-7' />
            <Grid container>
              <Grid item xs={12} sm={12} className='flex flex-row pie-5 gap-[26px]'>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-heart text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Love</Typography>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-message-circle text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Comment</Typography>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-link text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Copy</Typography>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-send text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Share</Typography>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardMedia image={`${process.env.NEXT_PUBLIC_BASEPATH}/images/posts/2.png`} className='bs-[180px]' />
          <CardContent className='relative'>
            <Avatar
              src='https://rd.infoma.net/routefile/userdisplay/667a90b269833176719371ef/7f2e5a3e-0cb7-430b-9c9f-2a5534f0f3f8.jpg'
              alt='Robert Meyer'
              className='is-[78px] bs-[78px] border-[5px] border-backgroundPaper absolute start-[11px] block-start-[-39px]'
            />
            <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2 mbe-5 mbs-[30px]'>
              <div className='flex flex-col items-start'>
                <Typography variant='h5'>Chulapak Boonyasophon</Typography>
                <Typography variant='body2'>Resarch & Development / ผู้จัดการ (Manager)</Typography>
              </div>
              <Button variant='contained' onClick={() => router.push('/en/users/profile/chulapak@excelink.co.th')}>
                View profile
              </Button>
            </div>
            <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2'>
              <Typography variant='h5' className='mbe-2'>
                Influencing The Influencer
              </Typography>
              <Typography color='text.secondary'>
                Cancun is back, better than ever! Over a hundred Mexico resorts have reopened and the state tourism
                minister predicts Cancun will draw as many visitors in 2006 as it did two years ago.
              </Typography>
            </div>
            <Divider className='mbs-7 mbe-7' />
            <Grid container>
              <Grid item xs={12} sm={12} className='flex flex-row pie-5 gap-[26px]'>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-heart text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Love</Typography>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-message-circle text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Comment</Typography>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-link text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Copy</Typography>
                </div>
                <div className='flex items-center gap-2.5'>
                  <div className='flex'>
                    <i className='tabler-send text-xl text-textSecondary' />
                  </div>
                  <Typography color='text.secondary'>Share</Typography>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardMedia image={`${process.env.NEXT_PUBLIC_BASEPATH}/images/posts/3.png`} className='bs-[185px]' />
          <CardContent className='relative'>
            <Avatar
              src='https://rd.infoma.net/routefile/userdisplay/663185f9db3fa50eafc889ad/b16b1e7a-34da-4d12-b814-5fba08826154.jpg'
              alt='Robert Meyer'
              className='is-[78px] bs-[78px] border-[5px] border-backgroundPaper absolute start-[11px] block-start-[-39px]'
            />
            <div className='flex justify-between items-center flex-wrap gap-x-4 gap-y-2 mbe-5 mbs-[30px]'>
              <div className='flex flex-col items-start'>
                <Typography variant='h5'>Supachai Naowakul</Typography>
                <Typography variant='body2'>Resarch & Development / Frontend Developer</Typography>
              </div>
              <Button variant='contained' onClick={() => router.push('/en/users/profile/webmaster@excelink.co.th')}>
                View profile
              </Button>
            </div>
            <Typography variant='h5' className='mbe-3'>
              Popular Uses Of The Internet
            </Typography>
            <Typography color='text.secondary'>
              Although cards can support multiple actions, UI controls, and an overflow menu.
            </Typography>
          </CardContent>
          <CardActions className='justify-between card-actions-dense'>
            <Button onClick={() => setExpanded(!expanded)}>Details</Button>
            <IconButton onClick={() => setExpanded(!expanded)}>
              <i className={expanded ? 'tabler-chevron-up' : 'tabler-chevron-down'} />
            </IconButton>
          </CardActions>

          <Collapse in={expanded} timeout={300}>
            <Divider />
            <CardContent>
              <Typography color='text.secondary'>
                I&#39;m a thing. But, like most politicians, he promised more than he could deliver. You won&#39;t have
                time for sleeping, soldier, not with all the bed making you&#39;ll be doing. Then we&#39;ll go with that
                data file! Hey, you add a one and two zeros to that or we walk! You&#39;re going to do his laundry?
                I&#39;ve got to find a way to escape.
              </Typography>
            </CardContent>
          </Collapse>
          <Divider />
          <Grid container className='m-4'>
            <Grid item xs={12} sm={12} className='flex flex-row pie-5 gap-[26px]'>
              <div className='flex items-center gap-2.5'>
                <div className='flex'>
                  <i className='tabler-heart text-xl text-textSecondary' />
                </div>
                <Typography color='text.secondary'>Love</Typography>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='flex'>
                  <i className='tabler-message-circle text-xl text-textSecondary' />
                </div>
                <Typography color='text.secondary'>Comment</Typography>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='flex'>
                  <i className='tabler-link text-xl text-textSecondary' />
                </div>
                <Typography color='text.secondary'>Copy</Typography>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='flex'>
                  <i className='tabler-send text-xl text-textSecondary' />
                </div>
                <Typography color='text.secondary'>Share</Typography>
              </div>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Grid container>
            <Grid item xs={12} sm={7}>
              <CardContent>
                <Typography variant='h5' className='mbe-2'>
                  Lifetime Membership
                </Typography>
                <Typography color='text.secondary'>
                  Here, I focus on a range of items and features that we use in life without giving them a second
                  thought such as Coca Cola, body muscles and holding ones own breath. Though, most of these notes are
                  not fundamentally necessary, they are such that you can use them for a good laugh, at a drinks party
                  or for picking up women or men.
                </Typography>
                <Divider className='mbs-7 mbe-7' />
                <Grid container>
                  <Grid item xs={12} sm={6} className='flex flex-col pie-5 gap-[26px]'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex'>
                        <i className='tabler-lock-open text-xl text-textSecondary' />
                      </div>
                      <Typography color='text.secondary'>Full Access</Typography>
                    </div>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex'>
                        <i className='tabler-user text-xl text-textSecondary' />
                      </div>
                      <Typography color='text.secondary'>15 Members</Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    className='flex flex-col max-sm:mbs-[26px] sm:pis-5 sm:border-is gap-[26px]'
                  >
                    <div className='flex items-center gap-2.5'>
                      <div className='flex'>
                        <i className='tabler-lock-open text-xl text-textSecondary' />
                      </div>
                      <Typography color='text.secondary'>Access all Features</Typography>
                    </div>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex'>
                        <i className='tabler-user text-xl text-textSecondary' />
                      </div>
                      <Typography color='text.secondary'>Lifetime Free Update</Typography>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={5}>
              <CardContent className='flex items-center justify-center bs-full bg-actionHover'>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='flex items-baseline justify-center'>
                    <Typography variant='h5'>$</Typography>
                    <Typography variant='h1'>899</Typography>
                    <Typography variant='h5'>USD</Typography>
                  </div>
                  <Typography color='text.secondary' className='flex flex-col text-center'>
                    <span>5 Tips For Offshore</span>
                    <span>Software Development</span>
                  </Typography>
                  <Button variant='contained' className='mbs-5'>
                    Contact Now
                  </Button>
                </div>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SamplePostCard
