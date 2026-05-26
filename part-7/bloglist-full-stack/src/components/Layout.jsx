import { NavLink, Outlet } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import Notification from './Notification'

const activeLinkStyle = ({ isActive }) => ({
  color: isActive ? '#ffffff' : '#dbeafe'
})

const Layout = () => {
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <NavLink to="/" className="nav-brand">
          Blog App
        </NavLink>

        <div className="nav-actions">
          <NavLink to="/" className="app-nav-link" style={activeLinkStyle}>
            BLOGS
          </NavLink>
          <NavLink to="/users" className="app-nav-link" style={activeLinkStyle}>
            USERS
          </NavLink>
          <NavLink to="/" className="app-nav-link" style={activeLinkStyle}>
            NEW BLOG
          </NavLink>
        </div>
      </nav>

      <ErrorBoundary>
        <main className="app-main">
          <Notification />
          <Outlet />
        </main>
      </ErrorBoundary>
    </div>
  )
}

export default Layout
