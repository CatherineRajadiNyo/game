import React, { useState, useEffect } from 'react';
import _, { repeat } from 'lodash';
import './App.css';

const minWidth = 50;
const maxWidth = 150;

function App() {
    const [create, setCreate] = useState(false);
    const [join, setJoin] = useState(false);

    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const numRows = 6;
    const numCols = Math.floor(windowWidth / minWidth);
    
    let width = windowWidth / numCols;
    if (width > maxWidth) width = maxWidth;
    if (width < minWidth) width = minWidth;

    const [grid, setGrid] = useState(() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0));
        }
        return rows;
    });

    const changeColor = (x, y) => {
        let newGrid = [...grid];
        newGrid[x][y] = 1;
        setGrid(newGrid)
    }

    const createRoom = () => {
        setCreate(true)
        setJoin(true)
    }

    const joinRoom = () => {
        setCreate(true)
        setJoin(true)
    }

    return (
        <>
            <button disabled={create} onClick={()=>createRoom()}>create</button>
            <button disabled={join} onClick={()=>joinRoom()}>join</button>
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, ${width}px)`,
                margin: '0 auto'
            }}>
                {_.map(grid, (rows, i) => {
                    return _.map(rows, (cols, k) => (
                        <div
                            key={`${i}-${k}`}
                            onClick={() => changeColor(i, k)}
                            style={{
                                width: width,
                                height: width,
                                backgroundColor: grid[i][k] ? "pink" : undefined,
                                border: '1px solid black'
                            }}>{`${i}-${k}`}</div>
                    ))}
                )}
            </div>
        </>
    );
}

export default App;
