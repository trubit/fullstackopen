import useNotification from '../hooks/useNotification'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) {
    return null
  }

  return (
    <div className={`notification notification-${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification
