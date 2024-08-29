import React, { useEffect, useRef, useState } from 'react'
import AWS from 'aws-sdk'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { 
  Table, TableBody, TableCell, 
  TableContainer, TableRow,
  Paper, Typography, Box, Grid
} from '@mui/material'
import SportsHandballIcon from '@mui/icons-material/SportsHandball'
import apiUrls from './apiUrls'
import axios from 'axios'

const WebSocketComponent = () => {
  const [connectionID, setConnectionId] = useState(null)
  const [teamOne, setTeamOne] = useState([])
  const [teamTwo, setTeamTwo] = useState([])
  const wsRef = useRef(null)

  const register = (connectionId) => {
    axios.post(apiUrls.registerForStream, { connectionId }).then(() => console.log('registrado'))
    setConnectionId(connectionId)
  }

  const unregister = () => {
    if (connectionID) {
      axios.post(apiUrls.unregisterFromStream, { connectionId: connectionID }).then(() => console.log('registro removido'))
    }
  }

  useEffect(() => {
    const poolData = {
      UserPoolId: '',
      ClientId: '',
    }
    const userPool = new CognitoUserPool(poolData)

    const authenticationData = {
      Username: '',
      Password: '',
    }
    const authenticationDetails = new AuthenticationDetails(authenticationData)

    const userData = {
      Username: authenticationData.Username,
      Pool: userPool,
    }

    const cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const idToken = result.getIdToken().getJwtToken()

        AWS.config.region = 'us-east-1'
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: '',
          Logins: {
            '': idToken,
          },
        })

        AWS.config.credentials.get((err) => {
          if (err) {
            console.error('Erro ao obter credenciais do Cognito', err)
            return
          }

          if (!wsRef.current) {
            const websocketUrl = apiUrls.WSS
            const ws = new WebSocket(websocketUrl)

            ws.onopen = () => {
              console.log('Conectado ao WebSocket')
              ws.send(JSON.stringify({
                action: 'connectionId',
              }))
            }

            ws.onmessage = ({ data }) => {
              data = JSON.parse(data)
              console.log(data)
              if (data.type === 'connectionId') {
                register(data.data.connectionId)
              }

              else if (data.type === 'clientDataStream') {
                setTeamOne(data.data.data.teamOne)
                setTeamTwo(data.data.data.teamTwo)
              }
            }

            ws.onerror = (error) => {
              console.error('Erro no WebSocket:', error)
            }

            ws.onclose = () => {
              console.log('Conexão WebSocket fechada')
              unregister()
              wsRef.current = null
            }

            wsRef.current = ws
          }
        })
      },

      onFailure: (err) => {
        console.error('Falha na autenticação', err)
      },
    })

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      unregister()
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      unregister()
      const confirmationMessage = 'Você realmente deseja sair desta página?'
      event.returnValue = confirmationMessage
      return confirmationMessage
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [connectionID])

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column', 
        height: '100vh', 
        backgroundColor: '#f4f4f4' 
      }}
    >
      <Typography variant="h4" component="div" gutterBottom>
        Ultimo time sorteado
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" align="center" gutterBottom>
            Time 1
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {teamOne.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {player.name} 
                      {<SportsHandballIcon sx={{ marginLeft: 1, color: 'blue', display: player.isGoalkeeper ? 'visible' : 'none' }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" align="center" gutterBottom>
            Time 2
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {teamTwo.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {player.name} 
                      {<SportsHandballIcon sx={{ marginLeft: 1, color: 'blue', display: player.isGoalkeeper ? 'visible' : 'none' }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default WebSocketComponent
