import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@services'
import { gameSettings } from '@helpers'

const useResetGrid = () => {
  const { roomId } = useParams()
  const [isClearing, setIsClearing] = useState(false)

  async function resetGrid({
    move,
    round,
    numRows,
    numCols,
    startingTurn,
    player1Point,
    player2Point,
    grid,
  }) {
    try {
      const newMove =
        round === gameSettings.numOfRound ? gameSettings.numOfMoves : move - 1
      const totalGrid = numRows * numCols - 2
      await db
        .collection('rooms')
        .doc(roomId)
        .update({
          grid: grid,
          totalGrid: totalGrid,
          availableGrid: totalGrid,
          move: newMove,
          player1RemainingMoves: newMove,
          player2RemainingMoves: newMove,
          round: round === gameSettings.numOfRound ? 1 : round + 1,
          gameOver: false,
          player1Point: round === gameSettings.numOfRound ? 0 : player1Point,
          player2Point: round === gameSettings.numOfRound ? 0 : player2Point,
          player1Position: [0, 0],
          player2Position: [numRows - 1, numCols - 1],
          isPlayer1Turn: startingTurn === 1 ? false : true,
          startingTurn: startingTurn === 1 ? 2 : 1,
          message: startingTurn === 1 ? "Player 2's Turn" : "Player 1's Turn",
        })
    } catch (err) {
      console.error(err)
    }

    setIsClearing(true)
  }

  return { isClearing, resetGrid }
}

export default useResetGrid
