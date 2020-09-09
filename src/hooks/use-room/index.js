import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '@services'

const useRoom = () => {
  const { roomId } = useParams()
  const [room, setRoom] = useState()
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const unsubscribe = db
      .collection('rooms')
      .doc(roomId)
      .onSnapshot((doc) => {
        if (doc.exists) setRoom(doc.data())
        else console.log('Room not found')
        setIsFetching(false)
      })

    return () => {
      unsubscribe()
    }
  }, [roomId])

  return { isFetching, room }
}

export default useRoom
