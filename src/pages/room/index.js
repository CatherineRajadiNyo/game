import React from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import _ from 'lodash'
import { useRoom } from '@hooks'
import Grid from './grid'
import GameStats from './game-stats'

const Room = () => {
  const history = useHistory()
  const [cookies, setCookie] = useCookies(['user'])

  const { isFetching, room } = useRoom()

  if (isFetching) return <h1>Loading Room...</h1>
  if (!room) return <h1>Room Not Found...</h1>

  const { player1Id, player2Id } = room

  if (_.isEmpty(cookies.user)) {
    history.push('/')
  }

  let playerNumber
  if (player1Id == cookies.user) playerNumber = 1
  if (player2Id == cookies.user) playerNumber = 2

  return (
    <>
      <GameStats room={room} playerNumber={playerNumber} />
      <Grid room={room} playerNumber={playerNumber} />
    </>
  )
}

export default Room
