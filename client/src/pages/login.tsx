import { FormEvent, use, useState } from "react";
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router'

import InputGroup from '@/components/InputGroup';
import { useAuthDispatch, useAuthState } from "@/context/auth";

export default function Register() {
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<any>({})

    const dispatch = useAuthDispatch()
    const { authenticated } = useAuthState()
    
    const router = useRouter()
    if(authenticated)
        router.push('/')

    const submitForm =async (event: FormEvent) => {
        event.preventDefault()

        try {
            const res = await axios.post('/auth/login',{
                username, password
            })

            if(dispatch)
                dispatch({ type: 'LOGIN', payload: res.data })

            router.back()
        } catch (error: any) {
            setErrors(error.response.data)
        }

    }
    
    return (
        <div className="flex">
            <div>
                <Head>
                    <title>Login</title>
                    <link rel="icon" href="/icons/icon_small.png" />
                </Head>
            </div>

            <div className="h-screen bg-center bg-cover w-36" style={{ backgroundImage: "url('/images/background.jpg')" }}
            ></div>

            <div className="flex flex-col justify-center pl-6">
                <div>
                    <h1 className="mb-2 text-xl font-medium text-fuchsia-100">
                        Login MF
                    </h1>
                    <form onSubmit={submitForm}>
                        <InputGroup
                            className="mb-2"
                            type="text"
                            value={username}
                            setValue={setUserName}
                            placeholder="USERNAME"
                            error={errors.username}
                        />
                        <InputGroup
                            className="mb-4"
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="PASSWORD"
                            error={errors.password}
                        />

                        <button className="w-full py-3 mb-4 font-bold transition border rounded duraiton-50 text-s text-fuchsia-200 bg-fuchsia-700 border-fuchsia-700 hover:bg-fuchsia-900">
                            Login
                        </button>
                    </form>
                    <small className="text-fuchsia-100">
                        Not a weeb yet?
                        <Link legacyBehavior href="/register">
                            <a className="ml-1 uppercase text-fuchsia-500">Sign Up</a>
                        </Link>
                    </small>
                </div>
            </div>


        </div>
    )
}
