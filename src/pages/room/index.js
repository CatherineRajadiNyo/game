import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import _ from 'lodash'
import { useRoom, useJoinRoom } from '@hooks'
import Grid from './grid'
import GameStats from './game-stats'

const Room = () => {
  const history = useHistory()
  const { roomId } = useParams()
  const [cookies, setCookie] = useCookies(['user'])
  const [playerNumber, setPlayerNumber] = useState('')

  const { isFetching, room } = useRoom()
  const { isJoiningRoom, joinRoom } = useJoinRoom()

  if (_.isEmpty(cookies.user)) {
    history.push('/')
    return
  }

  useEffect(() => {
    if (room) {
      const { player1Id, player2Id } = room
      if (player1Id == cookies.user) setPlayerNumber(1)
      if (player2Id == cookies.user) setPlayerNumber(2)

      const fetchData = async () => {
        if (_.isEmpty(player2Id) && player1Id != cookies.user) {
          const result = joinRoom(roomId)
          if (result) setPlayerNumber(2)
        }
      }

      fetchData()
    }
  }, [isFetching])

  return (
    <>
      {isFetching ? (
        <h1>Loading Room...</h1>
      ) : !room ? (
        <h1>Room Not Found...</h1>
      ) : (
        <>
          <GameStats room={room} playerNumber={playerNumber} />
          <Grid room={room} playerNumber={playerNumber} />
        </>
      )}
    </>
  )
}

export default Room
