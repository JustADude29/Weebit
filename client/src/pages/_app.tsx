import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import axios from 'axios'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

import NavBar from '@/components/Navbar'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  return <Fragment>
    {!authRoute && <NavBar/>}
    <Component {...pageProps} />
  </Fragment>
}
