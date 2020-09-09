import _ from 'lodash'
import { operation, player } from '@helpers'

const checkGameBoard = ({
  newGrid,
  numRows,
  numCols,
  isPlayer1Turn,
  player1Position,
  player2Position,
  player1RemainingMoves,
  player2RemainingMoves,
  x,
  y,
}) => {
  if (player1RemainingMoves > 0 && player2RemainingMoves > 0) return 'NONE'

  const userCurrentPos = [x, y]
  const opponentCurrentPos = isPlayer1Turn ? player2Position : player1Position

  // if current player move to opponent current position, opponent lose
  if (
    userCurrentPos[0] === opponentCurrentPos[0] &&
    userCurrentPos[1] === opponentCurrentPos[1]
  ) {
    return isPlayer1Turn ? 'PLAYER1WIN' : 'PLAYER2WIN'
  }

  // check if has available neighbor
  let neighbor = 0
  _.forEach(operation, (val) => {
    const neighborX = x + val.x
    const neighborY = y + val.y
    if (
      neighborX >= 0 &&
      neighborX < numRows &&
      neighborY >= 0 &&
      neighborY < numCols &&
      newGrid[neighborX][neighborY] === player.noPlayer
    ) {
      neighbor++
    }
  })
  // if not available, player lose
  if (neighbor === 0) {
    return isPlayer1Turn ? 'PLAYER2WIN' : 'PLAYER1WIN'
  }

  let allGridOccupied = false
  _.map(newGrid, (o) => {
    allGridOccupied = !_.includes(o, player.noPlayer)
  })

  if (allGridOccupied) return 'DRAW'

  return 'NONE'
}

export default checkGameBoard
