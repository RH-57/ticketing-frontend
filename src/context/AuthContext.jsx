/* eslint-disable react/prop-types */
import {createContext, useState, useEffect} from "react"
import Cookies from "js-cookie"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'))

    useEffect(() => {
        const handlerTokenChange = () => {
            setIsAuthenticated(!!Cookies.get('token'))
        }

        window.addEventListener('storage', handlerTokenChange);
        return () => {
            window.removeEventListener('storage', handlerTokenChange)
        }
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}