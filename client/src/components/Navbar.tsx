import Link from "next/link"

import Logo from '../../public/images/home.svg'
import { useAuthDispatch, useAuthState } from "@/context/auth"
import { Fragment } from "react"
import axios from "axios"

const NavBar: React.FC = () => {
    const { authenticated, loading } = useAuthState()
    const dispatch = useAuthDispatch()

    const logout = () => {
        axios.get('/auth/logout')
            .then(() => {
                if(dispatch)
                    dispatch({type: 'LOGOUT'})
                window.location.reload() 
            })
            .catch(err => console.log(err))
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
            <div className="flex items-center mx-auto border rounded border-fuchsia-800 bg-fuchsia-800 hover:bg-fuchsia-700 hover:border-purple-700">
                <i className="pl-3 pr-2 text-fuchsia-500 fas fa-search"></i>
                <input 
                    type="text" 
                    className="py-1 pr-3 bg-transparent outline-none w-160 focus:outline-none caret-fuchsia-500 text-fuchsia-300 placeholder-fuchsia-600"
                    placeholder="Search"
                />
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