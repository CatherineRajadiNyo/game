import React from 'react'
import _ from 'lodash'
import { useRoom } from '@hooks'

import Grid from './grid'
import GameStats from './game-stats'

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
