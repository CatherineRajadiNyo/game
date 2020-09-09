import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { db } from '@services'
import { gameSettings } from '@helpers'
import uniqid from 'uniqid'

// function generateRandomRoomId() {
//   let result = ''
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   for (let i = 0; i < 4; i++)
//     result += characters.charAt(Math.floor(Math.random() * characters.length))
//   return result
// }

const useCreateRoom = () => {
  const [cookies, setCookie] = useCookies(['user'])
  const user = cookies.user
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  async function createRoom() {
    if (!user) return undefined

    setIsCreatingRoom(true)
    let roomId = user.roomId || undefined

    try {
      if (roomId) {
        const foundUserRoom = await db.collection('rooms').doc(roomId).get()
        if (foundUserRoom.exists) return roomId
      } else {
        let newIdGenerated = false
        roomId = uniqid()

        while (!newIdGenerated) {
          const foundRoom = await db.collection('rooms').doc(roomId).get()
          if (foundRoom.exists) roomId = uniqid()
          else newIdGenerated = true
        }
      }

      const { numOfMoves, numOfRows, minGridWidth } = gameSettings

      await db
        .collection('rooms')
        .doc(roomId)
        .set({
          owner: user,
          player1Id: user,
          player2Id: '',
          isPlayer1Turn: 1,
          startingTurn: 1,
          grid: {},
          message: 'Waiting for player 2...',
          availableGrid: 0,
          totalGrid: 0,
          move: numOfMoves,
          numCols: 0,
          numRows: numOfRows,
          player1Point: 0,
          player2Point: 0,
          player1Position: [0, 0],
          player2Position: [0, 0],
          player1RemainingMoves: numOfMoves,
          player2RemainingMoves: numOfMoves,
          width: minGridWidth,
          windowWidth: 0,
          round: 1,
          partiesJoined: 1,
        })
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreatingRoom(false)
      return roomId
    }
  }

  return { isCreatingRoom, createRoom }
}

export default useCreateRoom
