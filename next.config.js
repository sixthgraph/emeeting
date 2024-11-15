/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   nextScriptWorkers: true
  // },
  basePath: process.env.BASEPATH,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    //ignoreBuildErrors: true
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/home',
        permanent: true,
        locale: false
      }
    ]
  },
  async headers() {
    return [
      {
        // matching all API routes
        // source: '/api/:path*',

        source: '/(.*?)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTION' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin, X-Custom-Information'
          }
        ]
      }
    ]
  },

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false
}

module.exports = nextConfig
