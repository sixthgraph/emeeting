import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL

//const BASE_AUTH_URL = 'https://rd.infoma.net/routeflow-api'

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'content-type': 'application/json' }
})

export const axiosAuth = axios.create({
  //baseURL: BASE_AUTH_URL,
  headers: { 'content-type': 'application/json' }
})
