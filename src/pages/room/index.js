import React from 'react'
import _ from 'lodash'
import Grid from './grid'
import GameStats from './game-stats'
import { useRoom } from '@hooks'

const Room = () => {
  const { isFetching, room } = useRoom()

  if (isFetching) return <h1>Loading Room...</h1>
  if (!room) return <h1>Room Not Found...</h1>

  return (
    <>
      <GameStats room={room} />
      <Grid room={room} />
    </>
  )
}

export default Room
