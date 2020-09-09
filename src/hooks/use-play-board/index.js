import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@services'
import { getUpdatedGameState } from './helpers'

const usePlayBoard = () => {
  const { roomId } = useParams()
  const [isUpdatingBoard, setIsUpdatingBoard] = useState(false)

  async function updateBoard(x, y, room) {
    setIsUpdatingBoard(true)
    try {
      const {
        numRows,
        numCols,
        isPlayer1Turn,
        player1Point,
        player2Point,
        player1Position,
        player2Position,
        player1RemainingMoves,
        player2RemainingMoves,
        grid,
        availableGrid,
      } = room

      const {
        newPlayer1Position,
        newPlayer2Position,
        newGrid,
        newMessage,
        newGameOver,
        newPlayer1Point,
        newPlayer2Point,
        newAvailableGrid,
      } = getUpdatedGameState({
        grid,
        x,
        y,
        isPlayer1Turn,
        player1Position,
        player2Position,
        player1RemainingMoves,
        player2RemainingMoves,
        player1Point,
        player2Point,
        numRows,
        numCols,
        availableGrid,
      })

      await db
        .collection('rooms')
        .doc(roomId)
        .update({
          player1RemainingMoves:
            isPlayer1Turn && player1RemainingMoves > 0
              ? player1RemainingMoves - 1
              : player1RemainingMoves,
          player2RemainingMoves:
            !isPlayer1Turn && player2RemainingMoves > 0
              ? player2RemainingMoves - 1
              : player2RemainingMoves,
          player1Position: newPlayer1Position,
          player2Position: newPlayer2Position,
          player1Point: newPlayer1Point,
          player2Point: newPlayer2Point,
          isPlayer1Turn: !isPlayer1Turn,
          grid: newGrid,
          message: newMessage,
          gameOver: newGameOver,
          availableGrid: newAvailableGrid,
        })
    } catch (err) {
      console.error(err)
    }

    setIsUpdatingBoard(false)
  }

  return { isUpdatingBoard, updateBoard }
}

export default usePlayBoard
