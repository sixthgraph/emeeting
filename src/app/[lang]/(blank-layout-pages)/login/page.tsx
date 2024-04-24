// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Login from '@views/Login'

// Server Action Imports
// import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

type Props = {
  searchParams?: Record<'callbackUrl' | 'error', string>
}

const LoginPage = (props: Props) => {
  // Vars
  // const mode = getServerMode()
  // return <Login mode={mode} />

  return <Login error={props.searchParams?.error} callbackUrl={props.searchParams?.callbackUrl} />
}

export default LoginPage
