import useField from '../hooks/useField'

const BlogForm = ({ onCreate, onCancel, isSubmitting }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('url')

  const handleSubmit = (event) => {
    event.preventDefault()

    onCreate({
      title: title.value,
      author: author.value,
      url: url.value
    })

    title.reset()
    author.reset()
    url.reset()
  }

  return (
    <form className="card stack-form" onSubmit={handleSubmit}>
      <h3>Create new</h3>

      <label htmlFor="title">title</label>
      <input id="title" {...title.inputProps} required />

      <label htmlFor="author">author</label>
      <input id="author" {...author.inputProps} required />

      <label htmlFor="url">url</label>
      <input id="url" {...url.inputProps} required />

      <div className="button-row">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'saving...' : 'create'}
        </button>
        <button type="button" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  )
}

export default BlogForm
