import { useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import loginService from '../services/login'
import blogsService from '../services/blogs'
import persistentUserService from '../services/persistentUser'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const persistedUser = persistentUserService.getUser()

    if (persistedUser?.token) {
      blogsService.setToken(persistedUser.token)
    }

    return persistedUser
  })

  const login = async (credentials) => {
    const loggedInUser = await loginService.login(credentials)

    setUser(loggedInUser)
    blogsService.setToken(loggedInUser.token)
    persistentUserService.saveUser(loggedInUser)

    return loggedInUser
  }

  const logout = () => {
    setUser(null)
    blogsService.setToken(null)
    persistentUserService.removeUser()
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
