import React from 'react'
import _ from 'lodash'

const Grid = ({ grid, cols, width, windowWidth }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${width}px)`,
        margin: '0 auto',
        width: `${windowWidth}px`,
      }}
    >
      {_.map(grid, (rows, i) => {
        return _.map(rows, (cols, k) => {
          let currentBgColor
          switch (grid[i][k]) {
            case 0:
              currentBgColor = 'pink'
              break
            case 1:
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
