import { Grid } from '@mui/material'

import CommentListCard from './CommentListCard'
import CommentListTable from './CommentListTable'

const CommentList = ({ commentData }: { commentData?: any }) => {
  const commData: any = [
    {
      extraMembers: 9,
      title: 'React Developers',
      avatar: '/images/logos/react-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/1.png', name: 'Vinnie Mostowy' },
        { avatar: '/images/avatars/2.png', name: 'Allen Rieske' },
        { avatar: '/images/avatars/3.png', name: 'Julee Rossignol' }
      ],
      description:
        'We don’t make assumptions about the rest of your technology stack, so you can develop new features.',
      chips: [
        { title: 'React', color: 'primary' },
        { title: 'MUI', color: 'info' }
      ]
    },
    {
      extraMembers: 4,
      title: 'Vue.js Dev Team',
      avatar: '/images/logos/vue-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/5.png', name: "Kaith D'souza" },
        { avatar: '/images/avatars/6.png', name: 'John Doe' },
        { avatar: '/images/avatars/7.png', name: 'Alan Walker' }
      ],
      description:
        'The development of Vue and its ecosystem is guided by an international team, some of whom have chosen.',
      chips: [
        { title: 'Vuejs', color: 'success' },
        { color: 'error', title: 'Developer' }
      ]
    },
    {
      title: 'Creative Designers',
      avatar: '/images/logos/xd-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/1.png', name: 'Jimmy Ressula' },
        { avatar: '/images/avatars/2.png', name: 'Kristi Lawker' },
        { avatar: '/images/avatars/3.png', name: 'Danny Paul' }
      ],
      description:
        'A design or product team is more than just the people on it. A team includes the people, the roles they play.',
      chips: [
        { title: 'Sketch', color: 'warning' },
        { title: 'XD', color: 'error' }
      ]
    },
    {
      title: 'Support Team',
      avatar: '/images/icons/support-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/5.png', name: 'Andrew Tye' },
        { avatar: '/images/avatars/6.png', name: 'Rishi Swaat' },
        { avatar: '/images/avatars/7.png', name: 'Rossie Kim' }
      ],
      description:
        'Support your team. Your customer support team is fielding the good, the bad, and the ugly on daily basis.',
      chips: [{ title: 'Zendesk', color: 'info' }]
    },
    {
      extraMembers: 7,
      title: 'Digital Marketing',
      avatar: '/images/icons/social-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/1.png', name: 'Kim Merchent' },
        { avatar: '/images/avatars/2.png', name: "Sam D'souza" },
        { avatar: '/images/avatars/3.png', name: 'Nurvi Karlos' }
      ],
      description:
        'Digital marketing refers to advertising delivered through digital channels such as search engines, websites…',
      chips: [
        { title: 'Twitter', color: 'primary' },
        { color: 'success', title: 'Email' }
      ]
    },
    {
      extraMembers: 2,
      title: 'Event',
      avatar: '/images/logos/event-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/5.png', name: 'Vinnie Mostowy' },
        { avatar: '/images/avatars/6.png', name: 'Allen Rieske' },
        { avatar: '/images/avatars/7.png', name: 'Julee Rossignol' }
      ],
      description:
        'Event is defined as a particular contest which is part of a program of contests. An example of an event is the long…',
      chips: [{ title: 'Hubilo', color: 'success' }]
    },
    {
      title: 'Figma Resources',
      avatar: '/images/logos/figma-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/1.png', name: 'Andrew Mostowy' },
        { avatar: '/images/avatars/2.png', name: 'Micky Ressula' },
        { avatar: '/images/avatars/3.png', name: 'Michel Pal' }
      ],
      description:
        'Explore, install, use, and remix thousands of plugins and files published to the Figma Community by designers.',
      chips: [
        { title: 'UI/UX', color: 'success' },
        { title: 'Figma', color: 'warning' }
      ]
    },
    {
      extraMembers: 8,
      title: 'Only Beginners',
      avatar: '/images/logos/html-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/5.png', name: 'Kim Karlos' },
        { avatar: '/images/avatars/6.png', name: 'Katy Turner' },
        { avatar: '/images/avatars/7.png', name: 'Peter Adward' }
      ],
      description:
        'Learn the basics of how websites work, front-end vs back-end. Learn basic HTML, CSS, and JavaScript.',
      chips: [
        { title: 'CSS', color: 'info' },
        { title: 'HTML', color: 'primary' }
      ]
    },
    {
      title: 'Python Developers',
      avatar: '/images/logos/python-bg.png',
      avatarGroup: [
        { avatar: '/images/avatars/5.png', name: 'Kim Karlos' },
        { avatar: '/images/avatars/6.png', name: 'Katy Turner' },
        { avatar: '/images/avatars/7.png', name: 'Peter Adward' }
      ],
      description:
        "Harness Python's versatility for web development, data analysis & system automation for cutting-edge solutions.",
      chips: [{ title: 'Python', color: 'info' }]
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CommentListTable commentData={commentData}></CommentListTable>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <CommentListCard data={commData} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CommentList
