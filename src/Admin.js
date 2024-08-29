import React, { useState, useEffect } from 'react'
import { 
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  Paper, Typography, Box, Switch, Grid, Button, TextField
} from '@mui/material'
import SportsHandballIcon from '@mui/icons-material/SportsHandball'
import axios from 'axios'
import ApiUrls from './apiUrls'

function Admin() {
  const [players, setPlayers] = useState([])

  const [teamOne, setTeamOne] = useState([])
  const [teamTwo, setTeamTwo] = useState([])
  const [playersPerTeam, setPlayersPerTeam] = useState(0)

  const updatePlayerPresent = async ({ id, isPresent }) => {
    await axios.post(ApiUrls.updatePresent, { playerId: id, value: isPresent })
  }

  const handlePresenceToggle = (player, index) => {
    const updatedPlayers = [...players]
    updatedPlayers[index].isPresent = !updatedPlayers[index].isPresent
    setPlayers(updatedPlayers)
    updatePlayerPresent(player)
  }

  const createMatch = async () => {
    axios.post(ApiUrls.createMatch, { totalPlayers: playersPerTeam }).then(({ data }) => {
      setTeamOne(data.body.result.teamOne ? data.body.result.teamOne : [])
      setTeamTwo(data.body.result.teamTwo ? data.body.result.teamTwo : [])
    })
  }

  const handleCreateTeams = () => {
    createMatch()
  }

  const listPlayers = () => {
    axios.post(ApiUrls.listPlayers, {}).then(({ data }) => {
      setPlayers(data.body.result)
    }) 
  }

  useEffect(() => {
    listPlayers()
  }, [])

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
        Administração de Jogadores
      </Typography>
      <TableContainer component={Paper} sx={{ maxWidth: 800, marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="center">Nível de Habilidade</TableCell>
              <TableCell align="center">Goleiro</TableCell>
              <TableCell align="center">Presença</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {player.name}
                </TableCell>
                <TableCell align="center">{player.skillLevel}</TableCell>
                <TableCell align="center">
                  {player.isGoalkeeper ? "Sim" : "Não"}
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={player.isPresent == 1}
                    onChange={() => handlePresenceToggle(player, index)}
                    color="primary"
                    inputProps={{ 'aria-label': 'confirmar presença' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <TextField
          label="Jogadores por Time"
          type="number"
          value={playersPerTeam}
          onChange={(e) => setPlayersPerTeam(parseInt(e.target.value))}
          variant="outlined"
          sx={{ marginRight: 2 }}
        />
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleCreateTeams}
        >
          Sortear Time
        </Button>
      </Box>
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

export default Admin
