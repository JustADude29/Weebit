import { User } from "@/types";
import axios from "axios";
import { createContext, useReducer, Dispatch, useContext, useEffect } from "react";

interface State {
    authenticated: boolean
    user: User | undefined
    loading: boolean
}

interface Action {
    type: string
    payload?: any
}

const StateContext = createContext<State>({
    authenticated: false,
    user: undefined,
    loading: true
})

const DispatchContext = createContext<Dispatch<Action> | null>(null);

const reducer = (state: State, { type, payload }: Action) => {
    switch (type) {
        case 'LOGIN':
            return {
                ...state,
                authenticated: true,
                user: payload
            }
        case 'LOGOUT':
            return {
                ...state,
                authenticated: false,
                user: null
            }
        case 'STOP_LOADING':
            return {
                ...state,
                loading: false
            }
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, {
        user: null,
        authenticated: false,
        loading: true
    })

    useEffect(() => {
        async function loadUser(){
            try {
                const res = await axios.get('/auth/me')
                dispatch({ type: 'LOGIN', payload: res.data })
            } catch (error) {
                console.log(error)
            } finally {
                dispatch({ type: 'STOP_LOADING' })
            }
        }
        loadUser()
    }, [])

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)


