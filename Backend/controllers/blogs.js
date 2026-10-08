const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// FIX 1: Attach the authenticated user to the blog on creation
blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id // Safe link to creator ID
  })

  const savedBlog = await blog.save()
  
  // Track the blog reference on the user object as well
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// FIX 2: Safely check ownership using optional chaining (?.) to prevent crashes
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Use optional chaining (?.) to prevent calling .toString() on undefined fields
  if (blog.user?.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end() 
  }

  return response.status(401).json({ error: 'unauthorized user' })
})

module.exports = blogsRouter
