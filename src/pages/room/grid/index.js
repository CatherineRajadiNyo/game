import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useInitialBoardSize, usePlayBoard, useRoom } from '@hooks'
import { operation, player } from '@helpers'

const minWidth = 100
const maxWidth = 150
const { innerWidth: windowWidth } = window

const Grid = ({ room }) => {
  const { isUpdating, setBoardSize } = useInitialBoardSize()
  // const { isFetching, room } = useRoom()
  const { isUpdatingBoard, updateBoard } = usePlayBoard()

  const {
    grid,
    numRows,
    numCols,
    width,
    isPlayer1Turn,
    player1Point,
    player2Point,
    player1Position,
    player2Position,
    player1RemainingMoves,
    player2RemainingMoves,
    gameStart,
    gameOver,
    noPlayer,
    move,
  } = room

  const board = grid

  useEffect(() => {
    const { innerWidth: windowWidth } = window
    const newNumCols = Math.floor(windowWidth / minWidth)

    let gridWidth = windowWidth / newNumCols
    if (gridWidth > maxWidth) gridWidth = maxWidth
    if (gridWidth < minWidth) gridWidth = minWidth

    const newBoard = clearBoard(numRows, newNumCols)

    setBoardSize(gridWidth, windowWidth, newBoard, numRows, newNumCols, move)
  }, [])

  const clearBoard = (noOfRows, noOfCols) => {
    const rows = {}
    for (let i = 0; i < noOfRows; i++) {
      rows[i] = Array.from(Array(noOfCols), () => noPlayer)
    }
    rows[0][0] = 1
    rows[noOfRows - 1][noOfCols - 1] = 0
    return rows
  }

  async function movePlayerPosition(direction) {
    const userPos = isPlayer1Turn ? player1Position : player2Position
    const newX = userPos[0] + operation[direction].x
    const newY = userPos[1] + operation[direction].y

    await updateBoard(newX, newY, room)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event
      if (operation[key] && !gameOver) movePlayerPosition(key)
      return
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, ${width}px)`,
        margin: '0 auto',
        width: `${windowWidth}px`,
      }}
    >
      {_.map(board, (rows, i) => {
        return _.map(rows, (numCols, k) => {
          let currentBgColor
          switch (board[i][k]) {
            case player.player1Value:
              currentBgColor = 'pink'
              break
            case player.player2Value:
              currentBgColor = 'blue'
              break
            default:
              currentBgColor = 'white'
              break
          }

          return (
            <div
              key={`${i}-${k}`}
              style={{
                width: width,
                height: width,
                backgroundColor: currentBgColor,
                border: '1px solid black',
              }}
            >{`${i}-${k}`}</div>
          )
        })
      })}
    </div>
  )
}

export default Grid
