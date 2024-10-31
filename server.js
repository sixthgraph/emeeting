/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('http')

const { parse } = require('url')

const next = require('next')

const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000 //const port = 3000

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', err => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })

  const io = new Server(httpServer)

  io.on('connection', socket => {
    // ...
    console.log('connected:' + socket.id)

    let userEmail

    socket.on('join-email', email => {
      userEmail = email
      socket.join(userEmail)
      console.log('Join socket with "' + userEmail + '" success.')
    })

    socket.on('join-work-id', wid => {
      socket.join(wid)
      console.log('Join socket with "' + wid + '" success.')
    })

    socket.on('leave-work-wid', wid => {
      console.log('leave from workid "' + wid + '" success.')
    })

    socket.on('update-work-message', updateData => {
      console.log('update-work-message data ====')
      console.log(updateData)
      const wid = updateData.wid

      io.to(wid).emit('update-work-message', updateData)

      // {
      //   wid: '67208859a08614f4fd1d9c47',
      //   registeruid: '',
      //   message: '1111',
      //   file: '',
      //   location: '',
      //   level: 0,
      //   itemno: 0,
      //   reply_itemno: 0
      // }
    })

    socket.on('disconnect', async () => {
      const sockets = await io.in(userEmail).fetchSockets()

      if (sockets.length === 0) {
        console.log('All user offline')
      } else {
        console.log('User online : ' + sockets.length)
      }
    })
  })
})
