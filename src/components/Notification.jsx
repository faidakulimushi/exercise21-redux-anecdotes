import { useSelector } from 'react-redux'

const Notification = () => {
  // Extract the notification string slice from the global state
  const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  // If there is no message stored in state, don't render the border box at all
  if (!notification) {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification