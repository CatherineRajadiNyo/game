import { player } from '@helpers'

const resetBoard = (noOfRows, noOfCols) => {
  const rows = {}
  for (let i = 0; i < noOfRows; i++) {
    rows[i] = Array.from(Array(noOfCols), () => player.noPlayer)
  }
  rows[0][0] = 1
  rows[noOfRows - 1][noOfCols - 1] = 0
  return rows
}

export default resetBoard
