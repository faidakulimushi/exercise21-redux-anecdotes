import { Alert } from '@mui/material'

const Notification = ({ message, error }) => {
  if (!message) return null

  return (
    <Alert severity={error ? 'error' : 'success'}>
      {message}
    </Alert>
  )
}

export default Notification