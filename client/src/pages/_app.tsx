import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import axios from 'axios'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import { AuthProvider } from "@/context/auth"

import NavBar from '@/components/Navbar'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api'
axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
    try {
        const res = await(axios.get(url))
        return res.data
    } catch (err: any) {
        throw err.response.data
    }
}

export default function App({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter()
    const authRoutes = ['/register', '/login']
    const authRoute = authRoutes.includes(pathname)

    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 10000,
            }}
        >
            <AuthProvider>
                {!authRoute && <NavBar />}
                <Component {...pageProps} />
            </AuthProvider>
        </SWRConfig>
    )
}
