import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@services'

const useResetGrid = () => {
  const { roomId } = useParams()
  const [isClearing, setIsClearing] = useState(false)

  async function resetGrid(move, round, numRows, numCols, startingTurn) {
    try {
      await db
        .collection('rooms')
        .doc(roomId)
        .update({
          grid: [],
          move: move - 1,
          round: round - 1,
          gameOver: false,
          gameStart: true,
          player1Position: [0, 0],
          player2Position: [numCols - 1, numRows - 1],
          isPlayer1Turn: startingTurn === 1 ? false : true,
          startingTurn: startingTurn === 1 ? 2 : 1,
        })
    } catch (err) {
      console.error(err)
    }

    setIsClearing(true)
  }

  return { isClearing, resetGrid }
}

export default useResetGrid
