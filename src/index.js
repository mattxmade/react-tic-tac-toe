import "./style.css";
import App from "./components/App";

import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";

// Immutability is important
// concat over push

// Board handles Button state through props
// Controlled Components
//   | receive values from parent, Board
//   | inform parent when it is clicked

// Class component
/*class Square extends React.Component {
  handleClick = () => this.props.onClick();

  render() {
    return (
      <button className="square" onClick={this.handleClick}>
        {this.props.value}
      </button>
    );
  }
}*/

// Function component
function Square(props) {
  const handleClick = () => props.onClick();
  return (
    <button className="square" onClick={handleClick}>
      {props.value}
    </button>
  );
}

// <Component props=? />

// Board has class method renderSquare
// renderSqaure has ref to class component Square
// Board invokes render square with context
// Initial Board square is null - button rendered empty
// Game renders Board component

// Square component alerts Board when clicked
// Parent, Board passes props back to child
// Button is rendered with value of props
// Game renders Board component

// Here we passed a prop from parent Board component to
// child Square component

// state passes props to child with callback fn
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), positions: ["", ""] }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const coodinates = findPosition(i);

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, positions: coodinates }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // history
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      const row = step.positions[0] ? " row: " + step.positions[0] + " " : " ";
      const col = step.positions[1] ? " col: " + step.positions[1] + " " : " ";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc + row + col}</button>
        </li>
      );
    });

    let status;

    if (winner) status = "Winner: " + winner;
    else status = "Next player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
// Helper functions

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function findPosition(cellNum) {
  const row = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const col = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const result = [];
  const positionFlow = Array(3).fill(null);

  positionFlow.forEach((array, index) => {
    if (row[index].includes(cellNum)) result.push(index + 1);
    if (col[index].includes(cellNum)) result.push(index + 1);
  });

  return result;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
