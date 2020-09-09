import _ from 'lodash'
import { player } from '@helpers'
import checkGameBoard from './check-game-board'

const getUpdatedGameState = ({
  grid,
  x,
  y,
  isPlayer1Turn,
  player1Position,
  player2Position,
  player1RemainingMoves,
  player2RemainingMoves,
  player1Point,
  player2Point,
  numRows,
  numCols,
}) => {
  const newGrid = grid
  newGrid[x][y] = isPlayer1Turn ? player.player1Value : player.player2Value

  if (!(player1RemainingMoves === 0 && player2RemainingMoves === 0)) {
    const playerPrevPos = isPlayer1Turn ? player1Position : player2Position
    const playerPrevPosX = playerPrevPos[0]
    const playerPrevPosY = playerPrevPos[1]
    newGrid[playerPrevPosX][playerPrevPosY] = player.noPlayer
  }

  let newPlayer1Position = player1Position
  let newPlayer2Position = player2Position
  if (isPlayer1Turn) {
    newPlayer1Position = [x, y]
  } else {
    newPlayer2Position = [x, y]
  }

  // get game outcome
  const outcome = checkGameBoard({
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
  })

  let newMessage = ''
  let newGameOver = false
  let newPlayer1Point = player1Point
  let newPlayer2Point = player2Point

  switch (outcome) {
    case 'PLAYER1WIN': {
      newMessage = 'PLAYER 1 WINS!'
      newGameOver = true
      newPlayer1Point = player1Point + 1
      break
    }
    case 'PLAYER2WIN': {
      newMessage = 'PLAYER 2 WINS!'
      newGameOver = true
      newPlayer2Point = player2Point + 1
      break
    }
    // case 'DRAW': {
    //   newMessage = 'DRAW!'
    //   newGameOver = true
    //   break
    // }
    case 'NONE':
    default:
      newMessage = `Player ${isPlayer1Turn ? '2' : '1'}'s Turn`
  }

  return {
    newPlayer1Position,
    newPlayer2Position,
    newGrid,
    newMessage,
    newGameOver,
    newPlayer1Point,
    newPlayer2Point,
  }
}

export default getUpdatedGameState
