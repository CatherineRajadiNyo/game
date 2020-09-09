import React, { useEffect } from 'react'
import _ from 'lodash'
import { useInitialBoardSize, usePlayBoard } from '@hooks'
import { operation, player, gameSettings, resetBoard } from '@helpers'

const { innerWidth: userWindowWidth } = window

const Grid = ({ room }) => {
  const { isUpdating, setBoardSize } = useInitialBoardSize()
  const { isUpdatingBoard, updateBoard } = usePlayBoard()
  const { minGridWidth, maxGridWidth, maxPlayerPerRoom } = gameSettings

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
    partiesJoined,
    windowWidth,
  } = room

  useEffect(() => {
    if (_.isEmpty(grid)) {
      let newWindowWidth = windowWidth
      if (windowWidth === 0) newWindowWidth = userWindowWidth
      if (windowWidth > 0 && userWindowWidth < windowWidth)
        newWindowWidth = userWindowWidth

      const newNumCols = Math.floor(newWindowWidth / minGridWidth)

      let gridWidth = newWindowWidth / newNumCols
      if (gridWidth > maxGridWidth) gridWidth = maxGridWidth
      if (gridWidth < minGridWidth) gridWidth = minGridWidth

      const newBoard =
        partiesJoined === maxPlayerPerRoom
          ? resetBoard(numRows, newNumCols)
          : {}

      setBoardSize({
        gridWidth,
        windowWidth: newWindowWidth,
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
      if (operation[key] && !gameOver && partiesJoined == maxPlayerPerRoom)
        movePlayerPosition(key)
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
      {partiesJoined == maxPlayerPerRoom &&
        _.map(grid, (rows, i) => {
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
