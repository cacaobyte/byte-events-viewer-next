"use client"

import * as React from "react"
import {
  getCurrentUser,
  login,
  LoginCredentials,
  logout,
  User,
} from "@/services/user-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = React.createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    checkUser()
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    const loggedInUser = await login(credentials)

    setUser(loggedInUser)
  }

  const signOut = async () => {
    await logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
