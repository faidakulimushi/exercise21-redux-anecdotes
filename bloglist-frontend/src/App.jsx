import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material'
// the invitation of mluukaii to review the security of the PR
// Components
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
// Assuming these are in your src folder based on your previous message
import BlogDisplay from '../BlogDisplay'
import SingleBlogView from '../SingleBlogView'
// Services
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const match = useMatch('/blogs/:id')
  const matchedBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser),
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotificationType('error')
      setNotificationMessage('Wrong username or password')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: returnedBlog.user?.id || returnedBlog.user,
        },
      }
      setBlogs(blogs.concat(blogWithUser))
      setNotificationType('success')
      setNotificationMessage(`A new blog "${returnedBlog.title}" added!`)
      setTimeout(() => setNotificationMessage(null), 5000)
      navigate('/')
    } catch {
      setNotificationType('error')
      setNotificationMessage('Failed to add the blog.')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }
  const handleLikeBlog = async (id, blogToUpdate) => {
    try {
      const blogToSend = {
        ...blogToUpdate,
        user: blogToUpdate.user?.id || blogToUpdate.user,
      }

      const returnedBlog = await blogService.update(id, blogToSend)
      const originalBlog = blogs.find((blog) => blog.id === id)
      const finalizedBlog = {
        ...returnedBlog,
        user: originalBlog?.user,
      }

      setBlogs(blogs.map((blog) => (blog.id === id ? finalizedBlog : blog)))
    } catch (exception) {
      console.error('Update failed:', exception)
      setNotificationType('error')
      setNotificationMessage('Failed to update likes')
      setTimeout(() => setNotificationMessage(null), 5000)
    }
  }

  const handleRemoveBlog = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        setNotificationType('success')
        setNotificationMessage(`Successfully removed "${blog.title}"`)
        navigate('/')
      } catch (exception) {
        console.error('Remove failed:', exception)
        setNotificationType('error')
        const errorMsg =
          exception.response?.data?.error || 'Failed to delete the blog.'
        setNotificationMessage(errorMsg)
        setTimeout(() => setNotificationMessage(null), 5000)
      }
    }
  }

  return (
    <Container maxWidth="md">
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar sx={{ gap: 2 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Blogs
          </Link>
          {user && (
            <Link
              to="/create"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Create New
            </Link>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.name} logged in
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Login
            </Link>
          )}
        </Toolbar>
      </AppBar>

      <Typography variant="h4" gutterBottom>
        Blogs Application
      </Typography>
      <Notification message={notificationMessage} type={notificationType} />

      <Routes>
        <Route
          path="/"
          element={
            <Box mt={2}>
              {[...blogs]
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .map((blog) => (
                  <BlogDisplay
                    key={blog.id}
                    blog={blog}
                    handleLike={handleLikeBlog}
                    handleRemove={handleRemoveBlog}
                    currentUser={user}
                  />
                ))}
            </Box>
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <BlogForm createBlog={handleCreateBlog} />
            ) : (
              <Typography variant="h6">Please log in.</Typography>
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <SingleBlogView
              blog={matchedBlog}
              handleLike={handleLikeBlog}
              handleRemove={handleRemoveBlog}
              currentUser={user}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="h5" align="center">
                Log in
              </Typography>
              <TextField
                label="Username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                fullWidth
              />
              <Button variant="contained" type="submit">
                Login
              </Button>
            </Box>
          }
        />
      </Routes>
    </Container>
  )
}

export default App
