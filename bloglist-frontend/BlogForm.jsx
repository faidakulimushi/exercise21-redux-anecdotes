import { TextField, Button, Typography, Box } from '@mui/material'

const BlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  addBlog
}) => {
  return (
    <Box
      component="form"
      onSubmit={addBlog}
      sx={{
        width: 450,
        marginTop: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h5">
        Create New Blog
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={handleTitleChange}
        fullWidth
      />

      <TextField
        label="Author"
        value={author}
        onChange={handleAuthorChange}
        fullWidth
      />

      <TextField
        label="URL"
        value={url}
        onChange={handleUrlChange}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
      >
        Create
      </Button>
    </Box>
  )
}

export default BlogForm