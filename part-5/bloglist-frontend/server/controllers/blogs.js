const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../middleware/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1
  })

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    context: 'query'
  }).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(403).json({ error: 'only creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  request.user.blogs = request.user.blogs.filter(
    (blogId) => blogId.toString() !== request.params.id
  )
  await request.user.save()

  response.status(204).end()
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  if (!comment) {
    return response.status(400).json({ error: 'comment is required' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.comments = blog.comments.concat(comment)
  const updatedBlog = await blog.save()
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
