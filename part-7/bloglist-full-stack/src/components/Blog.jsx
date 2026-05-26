import { Link } from 'react-router-dom'

const Blog = ({ blog }) => (
  <article className="card">
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  </article>
)

export default Blog
