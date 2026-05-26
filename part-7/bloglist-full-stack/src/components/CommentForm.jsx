import useField from '../hooks/useField'

const CommentForm = ({ onAddComment, isSubmitting }) => {
  const comment = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!comment.value.trim()) {
      return
    }

    onAddComment(comment.value.trim())
    comment.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input id="comment" placeholder="add a comment" {...comment.inputProps} />
      <button type="submit" className="comment-submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'ADDING...' : 'ADD COMMENT'}
      </button>
    </form>
  )
}

export default CommentForm
