import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Modal from 'react-modal'
import uniqid from 'uniqid'
import { useCreateRoom, useJoinRoom } from '@hooks'
import './style.css'

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
}

Modal.setAppElement('#root')

const Home = () => {
  const history = useHistory()
  const [cookies, setCookie] = useCookies(['user'])
  const { isCreatingRoom, createRoom } = useCreateRoom()
  const { isJoiningRoom, joinRoom } = useJoinRoom()

  const [joiningRoomId, setJoiningRoomId] = useState('')
  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const addUserCookie = () => {
    setCookie('user', uniqid(), {
      path: '/',
    })
  }

  useEffect(() => {
    if (!cookies.user) addUserCookie()
  }, [])

  async function handleCreateRoom() {
    const roomId = await createRoom()
    history.push('room/' + roomId)
  }

  async function handleJoinRoom() {
    if (_.isEmpty(joiningRoomId)) return false
    const result = await joinRoom(joiningRoomId)
    if (result) history.push('room/' + joiningRoomId)
  }
  return (
    <>
      <h1 className="text-center">Home Page</h1>

      <div className="box">
        <button onClick={() => handleCreateRoom()} disabled={isCreatingRoom}>
          create room
        </button>
        <button onClick={openModal}>join room</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <h2 className="text-center">Join Room Id</h2>
        <div onClick={closeModal} className="modal-close">
          close
        </div>
        <input
          type="text"
          value={joiningRoomId}
          onChange={(e) => {
            setJoiningRoomId(e.target.value)
          }}
        />
        <button onClick={() => handleJoinRoom()} disabled={isJoiningRoom}>
          {`Join${isJoiningRoom ? 'ing' : ''}`}
        </button>
      </Modal>
    </>
  )
}

export default Home
