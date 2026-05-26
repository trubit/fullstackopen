import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import blogsService from '../services/blogs'
import useNotification from '../hooks/useNotification'
import CommentForm from './CommentForm'
import NotFound from './NotFound'

const getUserId = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.id ?? value._id ?? null
}

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  const {
    data: blogs = [],
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogsService.getAll
  })

  const likeMutation = useMutation({
    mutationFn: ({ blogId, payload }) => blogsService.update(blogId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (mutationError) => {
      showNotification(
        mutationError.response?.data?.error ?? 'Failed to like blog',
        'error'
      )
    }
  })

  const deleteMutation = useMutation({
    mutationFn: blogsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification('Blog removed')
      navigate('/')
    },
    onError: (mutationError) => {
      showNotification(
        mutationError.response?.data?.error ?? 'Failed to remove blog',
        'error'
      )
    }
  })

  const commentMutation = useMutation({
    mutationFn: (comment) => blogsService.addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification('Comment added')
    },
    onError: (mutationError) => {
      showNotification(
        mutationError.response?.data?.error ?? 'Failed to add comment',
        'error'
      )
    }
  })

  if (isPending) {
    return <div className="card">Loading blog...</div>
  }

  if (isError) {
    return (
      <div className="card">Error loading blog: {error?.message ?? 'unknown error'}</div>
    )
  }

  const blog = blogs.find((currentBlog) => currentBlog.id === id)

  if (!blog) {
    return <NotFound />
  }

  const handleLike = () => {
    const payload = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: getUserId(blog.user)
    }

    likeMutation.mutate({ blogId: blog.id, payload })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  return (
    <section className="card blog-detail-card">
      <h2>{blog.title}</h2>
      <p className="blog-detail-author">by {blog.author}</p>

      <a href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>

      <div className="button-row blog-detail-likes">
        <span>{blog.likes} likes</span>
        <button type="button" className="blog-like-btn" onClick={handleLike}>
          LIKE
        </button>
      </div>

      <div className="blog-added-by">Added by {blog.user?.name ?? 'unknown user'}</div>

      <h3>comments</h3>

      <CommentForm
        onAddComment={(comment) => commentMutation.mutate(comment)}
        isSubmitting={commentMutation.isPending}
      />

      <ul>
        {(blog.comments ?? []).map((comment, index) => {
          const text = typeof comment === 'string' ? comment : comment.comment
          const key = typeof comment === 'string' ? `${comment}-${index}` : comment.id

          return <li key={key}>{text}</li>
        })}
      </ul>

      <div>
        <Link to="/">back to blogs</Link>
      </div>

      <button
        type="button"
        className="danger-btn"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        remove
      </button>
    </section>
  )
}

export default BlogView
