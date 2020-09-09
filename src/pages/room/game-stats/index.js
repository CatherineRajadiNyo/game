import React from 'react'
import { gameSettings } from '@helpers'
import { useResetGrid } from '@hooks'
const GameStats = ({ room }) => {
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
  } = room

  const { isClearing, resetGrid } = useResetGrid()

  const reset = () => {
    resetGrid(move, round, numRows, numCols, startingTurn)
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
          {`Round ${round}/${gameSettings.numOfRound}`}
          <h3>{message}</h3>
        </div>

        <div>
          set your starting position
          <div
            style={{
              display: 'grid',
              gridColumnGap: '20px',
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            <div>
              {`Player 1 move count: ${player1RemainingMoves}/
              ${gameSettings.numOfMoves}`}
            </div>
            <div>
              {`Player 2 move count: ${player2RemainingMoves}/
              ${gameSettings.numOfMoves}`}
            </div>
          </div>
        </div>

        <div>
          Points
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

      <button
        onClick={() => reset()}
        style={{ display: !gameOver ? 'none' : 'block' }}
      >
        play again
      </button>
    </>
  )
}

export default GameStats
