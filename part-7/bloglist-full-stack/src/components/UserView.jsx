import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import usersService from '../services/users'

const UserView = () => {
  const { id } = useParams()

  const {
    data: users = [],
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll
  })

  if (isPending) {
    return <div className="card">Loading user...</div>
  }

  if (isError) {
    return (
      <div className="card">Error loading user: {error?.message ?? 'unknown error'}</div>
    )
  }

  const user = users.find((currentUser) => currentUser.id === id)

  if (!user) {
    return (
      <div className="card">
        <h2>User not found</h2>
      </div>
    )
  }

  return (
    <section className="card">
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs?.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </section>
  )
}

export default UserView
