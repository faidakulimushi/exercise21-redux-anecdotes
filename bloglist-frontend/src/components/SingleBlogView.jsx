const SingleBlogView = ({ blog, handleLike, handleRemove, currentUser }) => {
  if (!blog) {
    return <p>Blog post not found.</p>
  }

  const isPopulatedOwner =
    blog.user &&
    typeof blog.user === 'object' &&
    blog.user.username === currentUser?.username
  const isFreshCreation =
    blog.user &&
    typeof blog.user === 'string' &&
    (blog.user === currentUser?.id || blog.user === currentUser?.username)
  const isUnsavedLocalBlog = !blog.id && !blog._id
  const showRemoveButton =
    isPopulatedOwner || isFreshCreation || isUnsavedLocalBlog

  const addLike = () => {
    const userId =
      blog.user?.id ||
      blog.user?._id ||
      (typeof blog.user === 'string' ? blog.user : null)

    const updatedBlog = {
      user: userId,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    handleLike(blog.id, updatedBlog)
  }

  return (
    <div className="single-blog-view">
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div className="blog-url">
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div className="blog-likes">
        likes <span className="likes-count">{blog.likes || 0}</span>{' '}
        {currentUser && (
          <button className="like-btn" onClick={addLike}>
            like
          </button>
        )}
      </div>
      <div>
        added by {blog.user?.name || blog.user?.username || 'Anonymous'}
      </div>

      {showRemoveButton && (
        <button className="remove-btn" onClick={() => handleRemove(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

export default SingleBlogView
