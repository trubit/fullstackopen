import { useMemo, useReducer } from 'react'
import { NotificationContext } from './notificationContextValue'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { message: action.payload.message, type: action.payload.type }
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  const showNotification = (message, type = 'success', timeoutMs = 5000) => {
    dispatch({
      type: 'SHOW_NOTIFICATION',
      payload: { message, type }
    })

    window.setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, timeoutMs)
  }

  const value = useMemo(() => ({ notification, showNotification }), [notification])

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  )
}
