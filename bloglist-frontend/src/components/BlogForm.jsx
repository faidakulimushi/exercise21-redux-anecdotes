import { useState } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 350,
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h4" align="center">
        Create new blog
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        fullWidth
      />

      <TextField
        label="Author"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
        fullWidth
      />

      <TextField
        label="URL"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        fullWidth
      />

      <Button type="submit" variant="contained">
        Create
      </Button>
    </Box>
  )
}

export default BlogForm