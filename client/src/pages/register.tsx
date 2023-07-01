import { FormEvent, use, useState } from "react";
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router'

import InputGroup from '@/components/InputGroup';
import { useAuthState } from "@/context/auth";

export default function Register() {
    const [email, setEmail] = useState('')
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [agreement, setAgreement] = useState(false)
    const [errors, setErrors] = useState<any>({})

    const { authenticated } = useAuthState()
    
    const router = useRouter()    
    if(authenticated)
    router.push('/')

    const submitForm =async (event: FormEvent) => {
        event.preventDefault()

        if(!agreement){
            setErrors({...errors, agreement: 'You must agree to sell your life'})
            return
        }

        try {
             await axios.post('/auth/register',{
                email, username, password
            })

            router.push('/login')
        } catch (error: any) {
            setErrors(error.response.data)
        }

    }
    
    return (
        <div className="flex">
            <div>
                <Head>
                    <title>Register</title>
                    <link rel="icon" href="/icons/icon_small.png" />
                </Head>
            </div>

            <div className="h-screen bg-center bg-cover w-36" style={{ backgroundImage: "url('/images/background.jpg')" }}
            ></div>

            <div className="flex flex-col justify-center pl-6">
                <div>
                    <h1 className="mb-2 text-xl font-medium text-fuchsia-100">
                        Sign Up MF
                    </h1>
                    <p className="w-64 mb-10 text-xs text-fuchsia-100">
                        By continuing you agree to sell your life and never touch grass ever again
                    </p>
                    <form onSubmit={submitForm}>
                        <div className="mb-2">
                            <input
                                type="checkbox"
                                className="mr-1 cursor-pointer"
                                id="agreement"
                                checked = {agreement}
                                onChange = {e => setAgreement(e.target.checked)}
                            />
                            <label htmlFor="agreement" className="text-xs cursor-pointer text-fuchsia-50">I agree to forever remain a weeb</label>
                            <small className="block font-medium text-red-500 p">{errors.agreement}</small>
                        </div>
                        
                        <InputGroup
                            className="mb-2"
                            type="email"
                            value={email}
                            setValue={setEmail}
                            placeholder="EMAIL"
                            error={errors.email}
                        />
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
                            Sign Up
                        </button>
                    </form>
                    <small className="text-fuchsia-100">
                        Already a weeb?
                        <Link legacyBehavior href="/login">
                            <a className="ml-1 uppercase text-fuchsia-500">Log In</a>
                        </Link>
                    </small>
                </div>
            </div>


        </div>
    )
}
