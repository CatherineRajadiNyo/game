import { useState } from 'react'
import { useCookies } from 'react-cookie'
import _ from 'lodash'
import { db } from '@services'

const useJoinRoom = () => {
  const [cookies, setCookie] = useCookies(['user'])
  const user = cookies.user
  const [isJoiningRoom, setIsJoiningRoom] = useState(false)

  async function joinRoom(roomId) {
    if (!user) return undefined

    setIsJoiningRoom(true)

    try {
      const doc = await db.collection('rooms').doc(roomId).get()
      if (doc.exists) {
        const data = doc.data()
        if (!_.isEmpty(data.player1Id) && !_.isEmpty(data.player2Id))
          return alert('Room is Full')

        // welcome back user
        if (data.player1Id == user || data.player2Id == user) return true

        await db
          .collection('rooms')
          .doc(roomId)
          .update({
            player2Id: user,
            partiesJoined: data.partiesJoined + 1,
            message: data.isPlayer1Turn ? "Player 1's Turn" : "Player 2's Turn",
          })
        return true
      } else {
        return alert('Invalid Room Id')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsJoiningRoom(false)
    }
  }

  return { isJoiningRoom, joinRoom }
}

export default useJoinRoom
