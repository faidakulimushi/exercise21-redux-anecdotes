import { Card, CardContent, Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const BlogDisplay = ({ blog }) => {
  return (
    <Card sx={{ marginBottom: 2, border: '1px solid #e0e0e0', '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Typography variant="h6">{blog.title}</Typography>
        <Typography color="text.secondary">by {blog.author}</Typography>
        <Box sx={{ mt: 2 }}>
          <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
            View Details
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BlogDisplay