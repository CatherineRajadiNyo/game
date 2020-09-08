/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import _ from 'lodash'
import Grid from './grid'

const minWidth = 100
const maxWidth = 150
const numOfRound = 5

const ALLOWED_KEYS = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
}

const operation = {
  [ALLOWED_KEYS.ArrowUp]: { x: 0, y: -1 },
  [ALLOWED_KEYS.ArrowDown]: { x: 0, y: 1 },
  [ALLOWED_KEYS.ArrowLeft]: { x: -1, y: 0 },
  [ALLOWED_KEYS.ArrowRight]: { x: 1, y: 0 },
}

const { innerWidth: windowWidth, innerHeight: windowHeight } = window

const player1Value = 1
const player2Value = 0
const noPlayer = '-'

const Room = () => {
  const {id} = useParams()
  const numRows = 6
  const numCols = Math.floor(windowWidth / minWidth)

  let width = windowWidth / numCols
  if (width > maxWidth) width = maxWidth
  if (width < minWidth) width = minWidth

  const [create, setCreate] = useState(false)
  const [join, setJoin] = useState(false)
  const [gameStart, setGameStart] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [round, setRound] = useState(1)
  const [move, setMove] = useState(5)

  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true)
  const [player1Point, setPlayer1Point] = useState(0)
  const [player2Point, setPlayer2Point] = useState(0)
  const [player1Position, setPlayer1Position] = useState([0, 0])
  const [player2Position, setPlayer2Position] = useState([
    numCols - 1,
    numRows - 1,
  ])

  const [player1RemainingMoves, setPlayer1RemainingMoves] = useState(move)
  const [player2RemainingMoves, setPlayer2RemainingMoves] = useState(move)

  const clearGrid = () => {
    const rows = []
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => noPlayer))
    }
    rows[0][0] = 1
    rows[numRows - 1][numCols - 1] = 0
    return rows
  }

  const [grid, setGrid] = useState(() => {
    return clearGrid()
  })

  const updateGrid = (x, y) => {
    let newGrid = [...grid]
    newGrid[y][x] = isPlayer1Turn ? player1Value : player2Value

    if (!(player1RemainingMoves == 0 && player2RemainingMoves == 0)) {
      const playerPrevPos = isPlayer1Turn ? player1Position : player2Position
      const playerPrevPosX = playerPrevPos[0]
      const playerPrevPosY = playerPrevPos[1]
      newGrid[playerPrevPosY][playerPrevPosX] = noPlayer

      isPlayer1Turn
        ? setPlayer1RemainingMoves(player1RemainingMoves - 1)
        : setPlayer2RemainingMoves(player2RemainingMoves - 1)
    }

    isPlayer1Turn ? setPlayer1Position([x, y]) : setPlayer2Position([x, y])

    setGrid(newGrid)

    if (!gameOver) setIsPlayer1Turn(!isPlayer1Turn)
  }

  const createRoom = () => {
    setCreate(true)
    setJoin(true)
  }

  const joinRoom = () => {
    setCreate(true)
    setJoin(true)
    setGameStart(true)
  }

  const reset = () => {
    setGrid(clearGrid())
    setMove(move - 1)
    setRound(round + 1)
    setGameOver(false)
    setGameStart(true)
    setPlayer1Position([0, 0])
    setPlayer2Position([numCols - 1, numRows - 1])
  }

  const movePlayerPosition = (direction) => {
    const userCurrentPos = isPlayer1Turn ? player1Position : player2Position
    const opponentCurrentPos = isPlayer1Turn ? player2Position : player1Position
    const x = userCurrentPos[0] + operation[direction].x
    const y = userCurrentPos[1] + operation[direction].y

    // if current player move to opponent current position, opponent lose
    if (
      player1RemainingMoves == 0 &&
      player2RemainingMoves == 0 &&
      x === opponentCurrentPos[0] &&
      y === opponentCurrentPos[1]
    ) {
      isPlayer1Turn
        ? setPlayer1Point(player1Point + 1)
        : setPlayer2Point(player2Point + 1)
      updateGrid(x, y)
      over()
    }

    // check if can move position after keydown
    if (
      x >= 0 &&
      x < numCols &&
      y >= 0 &&
      y < numRows &&
      grid[y][x] === noPlayer
    ) {
      if (player1RemainingMoves == 0 && player2RemainingMoves == 0) {
        // check if has available neighbor
        let neighbor = 0
        _.forEach(operation, (val) => {
          const neighborX = x + val.x
          const neighborY = y + val.y
          if (
            neighborX >= 0 &&
            neighborX < numCols &&
            neighborY >= 0 &&
            neighborY < numRows &&
            grid[neighborY][neighborX] === noPlayer
          ) {
            neighbor++
          }
        })
        // if not available, die
        if (neighbor === 0) {
          // player lose
          over()
          isPlayer1Turn
            ? setPlayer2Point(player2Point + 1)
            : setPlayer1Point(player1Point + 1)
        }
      }

      updateGrid(x, y)
    }
  }

  const over = () => {
    setGameStart(false)
    setGameOver(true)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event
      if (operation[key] && gameStart && !gameOver) movePlayerPosition(key)
      return
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <>
      <h1>{id}</h1>
      <div
        style={{
          display: 'grid',
          gridColumnGap: '40px',
          gridTemplateColumns: `repeat(3, 1fr)`,
          marginBottom: '20px',
        }}
      >
        <div>
          Round {round}/{numOfRound}
          <div>Players turn: Player {isPlayer1Turn ? '1' : '2'}</div>
        </div>

        {/* STARTING POSITION */}
        <div>
          set your starting position
          <div
            style={{
              display: 'grid',
              gridColumnGap: '20px',
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            <div>
              Player 1 move count: {player1RemainingMoves}/{move}
            </div>
            <div>
              Player 2 move count: {player2RemainingMoves}/{move}
            </div>
          </div>
        </div>

        {/* POINT SYSTEM */}
        <div>
          Points
          <div
            style={{
              display: 'grid',
              gridColumnGap: '20px',
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            <div>Player 1: {player1Point}</div>
            <div>Player 2: {player2Point}</div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridColumnGap: '20px',
          gridTemplateColumns: `repeat(3, 100px)`,
          marginBottom: '20px',
        }}
      >
        <button disabled={create} onClick={() => createRoom()}>
          create
        </button>
        <button disabled={join} onClick={() => joinRoom()}>
          join
        </button>
        <button
          onClick={() => reset()}
          style={{ display: !gameOver ? 'none' : 'block' }}
        >
          restart
        </button>
      </div>
      <Grid
        grid={grid}
        cols={numCols}
        width={width}
        windowWidth={windowWidth}
      />
    </>
  )
}

export default Room
