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

            router.push('/')
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
                    <h1 className="mb-2 text-xl font-medium  text-green-800">
                        Login
                    </h1>
                    <form onSubmit={submitForm}>
                        <InputGroup
                            className="mb-2 text-green-700 placeholder-green-600"
                            type="text"
                            value={username}
                            setValue={setUserName}
                            placeholder="USERNAME"
                            error={errors.username}
                        />
                        <InputGroup
                            className="mb-4 text-green-700 placeholder-green-600"
                            type="password"
                            value={password}
                            setValue={setPassword}
                            placeholder="PASSWORD"
                            error={errors.password}
                        />

                        <button className="w-full py-3 mb-4 font-bold transition border rounded duraiton-50 text-s text-green-200 bg-green-700 border-green-700 hover:bg-green-900">
                            Login
                        </button>
                    </form>
                    <small className="text-green-500">
                        Not a weeb yet?
                        <Link legacyBehavior href="/register">
                            <a className="ml-1 uppercase text-green-600">Sign Up</a>
                        </Link>
                    </small>
                </div>
            </div>


        </div>
    )
}
