import { TextField, Button, Typography, Box } from '@mui/material'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => {
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
        Log in to application
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={handleUsernameChange}
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
      >
        Login
      </Button>
    </Box>
  )
}

export default LoginForm