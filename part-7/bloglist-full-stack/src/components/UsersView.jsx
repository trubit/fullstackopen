import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const UsersView = () => {
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
    return <div className="card">Loading users...</div>
  }

  if (isError) {
    return (
      <div className="card">Error loading users: {error?.message ?? 'unknown error'}</div>
    )
  }

  return (
    <section className="view-section">
      <h2 className="section-title">Users</h2>
      <div className="table-shell card">
        <table className="users-table">
          <thead>
            <tr>
              <th>name</th>
              <th>username</th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`} className="table-link">
                    {user.name}
                  </Link>
                </td>
                <td>{user.username}</td>
                <td>{user.blogs?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UsersView
