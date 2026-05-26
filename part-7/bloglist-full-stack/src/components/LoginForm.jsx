import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useNotification from '../hooks/useNotification'
import useField from '../hooks/useField'
import Notification from './Notification'

const LoginForm = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const { showNotification } = useNotification()
  const username = useField('text')
  const password = useField('password')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await login({ username: username.value, password: password.value })
      username.reset()
      password.reset()
      showNotification('Login successful')
      navigate('/')
    } catch (error) {
      showNotification(error.response?.data?.error ?? 'Wrong credentials', 'error')
    }
  }

  if (user) {
    return null
  }

  return (
    <div className="center-wrap">
      <div className="card auth-card">
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleSubmit} className="stack-form">
          <label htmlFor="username">username</label>
          <input id="username" {...username.inputProps} />

          <label htmlFor="password">password</label>
          <input id="password" {...password.inputProps} />

          <button type="submit">login</button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
