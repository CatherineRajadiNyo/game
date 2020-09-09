import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { gameSettings, resetBoard } from '@helpers'
import { useResetGrid } from '@hooks'

const GameStats = ({ room, playerNumber }) => {
  const {
    move,
    round,
    numRows,
    numCols,
    message,
    gameOver,
    startingTurn,
    player1Point,
    player2Point,
    player1RemainingMoves,
    player2RemainingMoves,
    player1Id,
    player2Id,
    partiesJoined,
  } = room

  const history = useHistory()

  const { roomId } = useParams()

  const { numOfRound, maxPlayerPerRoom } = gameSettings

  const { isClearing, resetGrid } = useResetGrid()

  const newBoard = resetBoard(numRows, numCols)

  const reset = () => {
    resetGrid({
      grid: newBoard,
      move,
      round,
      numRows,
      numCols,
      startingTurn,
      player1Point,
      player2Point,
    })
  }

  const goBack = () => {
    history.push('/')
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridColumnGap: '40px',
          gridTemplateColumns: `repeat(3, 1fr)`,
          marginBottom: '20px',
        }}
      >
        <div>
          <h3 className={`bg-player${playerNumber}`}>
            You are player {playerNumber}
          </h3>
          <h4>{message}</h4>
          <div
            style={{
              display: partiesJoined < maxPlayerPerRoom ? 'block' : 'none',
            }}
          >
            Share this room id with your friend: <strong>{roomId}</strong>
          </div>
          <button onClick={() => goBack()} className="bg-grey">
            Leave Game
          </button>
          <button
            onClick={() => reset()}
            style={{
              display: !gameOver ? 'none' : 'block',
            }}
          >
            {round === numOfRound ? 'start new set of game' : 'next round'}
          </button>
        </div>

        <div>
          <h3>{`Round ${round}/${numOfRound}`}</h3>
          <div>Set your starting position</div>
          <div
            style={{
              display: 'grid',
              gridColumnGap: '20px',
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            <div>{`Player 1 move count: ${player1RemainingMoves}`}</div>
            <div>{`Player 2 move count: ${player2RemainingMoves}`}</div>
          </div>
        </div>

        <div>
          <h3>Points</h3>
          <div
            style={{
              display: 'grid',
              gridColumnGap: '20px',
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            <div>Player 1: {player1Point}</div>
            <div>Player 2: {player2Point}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GameStats
