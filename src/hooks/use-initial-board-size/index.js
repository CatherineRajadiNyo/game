import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@services'

const useInitialBoardSize = () => {
  const { roomId } = useParams()
  const [isUpdating, setIsUpdating] = useState(false)

  async function setBoardSize({
    gridWidth,
    windowWidth,
    newBoard,
    numRows,
    newNumCols,
    move,
  }) {
    try {
      await db
        .collection('rooms')
        .doc(roomId)
        .update({
          windowWidth: windowWidth,
          width: gridWidth,
          grid: newBoard,
          numCols: newNumCols,
          player1Position: [0, 0],
          player2Position: [numRows - 1, newNumCols - 1],
        })
    } catch (err) {
      console.error(err)
    }

    setIsUpdating(true)
  }

  return { isUpdating, setBoardSize }
}

export default useInitialBoardSize
