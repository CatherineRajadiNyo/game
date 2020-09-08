import React from 'react'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const history = useHistory()

  function handleClick() {
    history.push('room/AAAA')
  }
  return (
    <>
      <h1>Home Page</h1>

      <button onClick={() => handleClick()}>Go to game room</button>
    </>
  )
}

export default Home
