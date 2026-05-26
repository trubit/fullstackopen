import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UsersView from './components/UsersView'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import NotFound from './components/NotFound'
import useAuth from './hooks/useAuth'

const App = () => {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<LoginForm />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<BlogList />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/users/:id" element={<UserView />} />
            <Route path="/blogs/:id" element={<BlogView />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
