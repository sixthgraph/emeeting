'use client'
import { Avatar, AvatarGroup, Card, CardContent, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material'

import OptionMenu from '@/@core/components/option-menu'

import Link from '@components/Link'

const CommentListCard = ({ data }: { data?: any; commentData?: any }) => {
  return (
    <>
      {data &&
        data?.map((item: any, index: any) => {
          return (
            <Grid item key={index} xs={12} md={6} lg={4}>
              <Card>
                <CardContent className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <Avatar src={item.avatar} className='bs-[38px] is-[38px]' />
                      <Typography variant='h5'>{item.title}</Typography>
                    </div>
                    <div className='flex items-center'>
                      <IconButton size='small'>
                        <i className='tabler-star text-textDisabled' />
                      </IconButton>
                      <OptionMenu
                        iconClassName='text-textDisabled'
                        options={[
                          'Rename Team',
                          'View Details',
                          'Add to Favorite',
                          { divider: true },
                          {
                            text: 'Delete Team',
                            menuItemProps: { className: 'text-error hover:bg-[var(--mui-palette-error-lightOpacity)]' }
                          }
                        ]}
                      />
                    </div>
                  </div>
                  <Typography>{item.description}</Typography>
                  <div className='flex items-center justify-between flex-wrap gap-4'>
                    <AvatarGroup
                      total={item.extraMembers ? item.extraMembers + 3 : 3}
                      sx={{ '& .MuiAvatar-root': { width: '2rem', height: '2rem', fontSize: '1rem' } }}
                      className='items-center pull-up'
                    >
                      {item.avatarGroup.map((person: any, index: any) => {
                        return (
                          <Tooltip key={index} title={person.name}>
                            <Avatar src={person.avatar} alt={person.name} />
                          </Tooltip>
                        )
                      })}
                    </AvatarGroup>
                    <div className='flex items-center gap-2'>
                      {item.chips.map((chip: any, index: any) => (
                        <Link key={index}>
                          <Chip variant='tonal' size='small' label={chip.title} color={chip.color} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
    </>
  )
}

export default CommentListCard
