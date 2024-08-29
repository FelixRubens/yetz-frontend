import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Button, Typography, Box } from '@mui/material'

function Login() {
  const navigate = useNavigate()

  const handleLogin = (role) => {
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/guest')
    }
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#f4f4f4' 
      }}
    >
      <Card 
        sx={{ 
          minWidth: 275, 
          boxShadow: 3, 
          p: 3, 
          borderRadius: 2,
          backgroundColor: 'white',
          alignItems: 'center',
        }}
      >
        <CardContent
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            Login
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleLogin('admin')}
            sx={{ marginBottom: 2, width: '100%' }}
          >
            Admin
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleLogin('guest')}
            sx={{ width: '100%' }}
          >
            Convidado
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
