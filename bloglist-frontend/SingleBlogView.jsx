import {
  Paper,
  Typography,
  Box,
  Button,
  Link,
  Stack,
  Divider,
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteIcon from '@mui/icons-material/Delete'

const SingleBlogView = ({ blog, handleLike, handleRemove, currentUser }) => {
  if (!blog) {
    return <Typography sx={{ mt: 4 }}>Blog post not found.</Typography>
  }

  // Refined ownership logic
  const username =
    typeof blog.user === 'string' ? blog.user : blog.user?.username
  const isOwner = username === currentUser?.username

  const addLike = () => {
    const updatedBlog = {
      user: blog.user?.id || blog.user,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    handleLike(blog.id, updatedBlog)
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {blog.title}
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        By {blog.author}
      </Typography>

      <Box sx={{ my: 2 }}>
        <Link href={blog.url} target="_blank" rel="noreferrer" variant="body1">
          {blog.url}
        </Link>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">
          Likes: <strong>{blog.likes || 0}</strong>
        </Typography>

        {currentUser && (
          <Button
            variant="contained"
            startIcon={<ThumbUpIcon />}
            onClick={addLike}
          >
            Like
          </Button>
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Added by: {blog.user?.name || blog.user?.username || 'Anonymous'}
      </Typography>

      {isOwner && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleRemove(blog)}
        >
          Remove Blog
        </Button>
      )}
    </Paper>
  )
}

export default SingleBlogView
