import Link from "next/link"
import { Fragment, SetStateAction, useEffect, useState } from "react"
import axios from "axios"

import Logo from '../../public/images/home.svg'
import { useAuthDispatch, useAuthState } from "@/context/auth"
import { Sub } from "@/types"
import Image from "next/image"
import { useRouter } from "next/router"

const NavBar: React.FC = () => {
    const [name, setName] = useState('')
    const [subs, setSubs] = useState<Sub[]>([])
    const [timer, setTimer] = useState<NodeJS.Timeout>()

    const { authenticated, loading } = useAuthState()
    const dispatch = useAuthDispatch()
    
    const router = useRouter()

    const logout = () => {
        axios.get('/auth/logout')
            .then(() => {
                if(dispatch)
                    dispatch({type: 'LOGOUT'})
                window.location.reload() 
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if(name.trim() === ''){
            setSubs([])
            return
        }
        searchSubs()
    }, [name])

    const searchSubs = async () => {
        clearTimeout(timer)
        setTimer(setTimeout(async () => {
            try {
                const { data } = await axios.get(`/sub/search/${name}`)
                setSubs(data)
            } catch (err) {
                console.log(err)
            }
        }, 250))
    }
    
    const goToSub = (subName: string) => {
        router.push(`/r/${subName}`)
        setName('')
    }

    return <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-fuchsia-950">
            {/* Title */}
            <div className="flex items-center">
                <Link legacyBehavior href="/">
                    <a>
                        <Logo className="w-8 h-8 mr-2"/>
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
                    <Link href="/">
                        weebit
                    </Link>
                </span>
            </div>
            {/* searchbar */}
            <div className="relative flex items-center mx-auto border rounded border-fuchsia-800 bg-fuchsia-800 hover:border-fuchsia-500">
                <i className="pl-3 pr-2 text-fuchsia-500 fas fa-search"></i>
                <input 
                    type="text" 
                    className="py-1 pr-3 bg-transparent outline-none w-160 caret-fuchsia-500 text-fuchsia-300 placeholder-fuchsia-600"
                    placeholder="Search"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div className="absolute left-0 right-0 bg-transparent" style={{ top:'100%' }}>
                    {subs?.map(sub => (
                        <div className="flex items-center px-4 py-3 rounded cursor-pointer bg-fuchsia-800 hover:bg-fuchsia-700" onClick={() => goToSub(sub.name)}>
                                <Image
                                    src={'/icons/icon_big.png'}
                                    alt="NULL"
                                    height={(8 * 16) / 4}
                                    width={(8 * 16) / 4}
                                    className="rounded-full"
                                />
                                <div className="ml-4 text-sm">
                                    <p className="font-medium text-fuchsia-400">{sub.name}</p>
                                    <p className="text-fuchsia-500">{sub.title}</p>
                                </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Login */}
            <div className="flex">
                { !loading && (authenticated ? (
                    <button className="w-32 py-2 mr-4 hollow button" onClick={logout}>
                        LogOut
                    </button>
                ): ( 
                    <Fragment>
                    <Link legacyBehavior href="/login">
                        <a className="w-32 py-2 mr-4 hollow button">
                            Login
                        </a>
                    </Link>
                    <Link legacyBehavior href="/register">
                        <a className="w-32 py-2 light button">
                            Sign Up
                        </a>
                    </Link> 
                    </Fragment>                   
                ))}
            </div>
        </div>
}

export default NavBar