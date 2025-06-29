import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

export const useAuth = () => {
  return useContext(AuthContext)
}

export const useAuthDispatch = () => {
  return useContext(AuthContext)
}
