import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@services'

const useInitialBoardSize = () => {
  const { roomId } = useParams()
  const [isUpdating, setIsUpdating] = useState(false)

  async function setBoardSize(
    width,
    windowWidth,
    grid,
    numRows,
    numCols,
    move
  ) {
    try {
      await db
        .collection('rooms')
        .doc(roomId)
        .update({
          windowWidth: windowWidth,
          width: width,
          grid: grid,
          numCols: numCols,
          isPlayer1Turn: true,
          player1Position: [0, 0],
          player2Position: [numRows - 1, numCols - 1],
          player1RemainingMoves: move,
          player2RemainingMoves: move,
        })
    } catch (err) {
      console.error(err)
    }

    setIsUpdating(true)
  }

  return { isUpdating, setBoardSize }
}

export default useInitialBoardSize
