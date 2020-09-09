import React, { useEffect } from 'react'
import _ from 'lodash'
import { useInitialBoardSize, usePlayBoard } from '@hooks'
import { operation, player, gameSettings, resetBoard } from '@helpers'

const { innerWidth: windowWidth } = window

const Grid = ({ room }) => {
  const { isUpdating, setBoardSize } = useInitialBoardSize()
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
    gameOver,
    noPlayer,
    move,
  } = room

  useEffect(() => {
    if (_.isEmpty(grid)) {
      const minWidth = gameSettings.minGridWidth
      const maxWidth = gameSettings.minGridWidth
      const newNumCols = Math.floor(windowWidth / minWidth)

      let gridWidth = windowWidth / newNumCols
      if (gridWidth > maxWidth) gridWidth = maxWidth
      if (gridWidth < minWidth) gridWidth = minWidth

      const newBoard = resetBoard(numRows, newNumCols)

      setBoardSize({
        gridWidth,
        windowWidth,
        numRows,
        newBoard,
        newNumCols,
        move,
      })
    }
  }, [])

  async function movePlayerPosition(direction) {
    const userPos = isPlayer1Turn ? player1Position : player2Position
    const oppPos = isPlayer1Turn ? player2Position : player1Position

    const newX = userPos[0] + operation[direction].x
    const newY = userPos[1] + operation[direction].y
    if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols) {
      // call updateboard only when neighbor is empty or when player collide
      if (
        grid[newX][newY] === player.noPlayer ||
        (player1RemainingMoves === 0 &&
          player2RemainingMoves === 0 &&
          newX === oppPos[0] &&
          newY === oppPos[1])
      ) {
        await updateBoard(newX, newY, room)
      }
    }
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
      {_.map(grid, (rows, i) => {
        return _.map(rows, (numCols, k) => {
          let currentBgColor
          switch (grid[i][k]) {
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
