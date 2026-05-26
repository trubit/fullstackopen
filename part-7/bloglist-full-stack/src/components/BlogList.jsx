import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogsService from '../services/blogs'
import BlogForm from './BlogForm'
import useNotification from '../hooks/useNotification'

const BlogList = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const [isCreateFormVisible, setCreateFormVisible] = useState(false)

  const {
    data: blogs = [],
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogsService.getAll
  })

  const createBlogMutation = useMutation({
    mutationFn: blogsService.create,
    onSuccess: (createdBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setCreateFormVisible(false)
      showNotification(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`)
    },
    onError: (mutationError) => {
      showNotification(
        mutationError.response?.data?.error ?? 'Failed to create blog',
        'error'
      )
    }
  })

  if (isPending) {
    return <div className="card">Loading blogs...</div>
  }

  if (isError) {
    return (
      <div className="card">Error loading blogs: {error?.message ?? 'unknown error'}</div>
    )
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <section>
      <h2>blogs</h2>

      {!isCreateFormVisible ? (
        <button type="button" onClick={() => setCreateFormVisible(true)}>
          create new blog
        </button>
      ) : (
        <BlogForm
          onCreate={(newBlog) => createBlogMutation.mutate(newBlog)}
          onCancel={() => setCreateFormVisible(false)}
          isSubmitting={createBlogMutation.isPending}
        />
      )}

      <div className="list-stack">
        {sortedBlogs.map((blog) => (
          <article className="card blog-row" key={blog.id}>
            <Link to={`/blogs/${blog.id}`} className="blog-title-link">
              {blog.title}
            </Link>
            <div className="blog-meta">
              by {blog.author} - likes {blog.likes}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogList
