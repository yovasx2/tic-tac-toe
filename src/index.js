import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={'square ' + (props.highlighted ? 'highlighted' : null)}
    onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} 
    highlighted={ -1!==this.props.winnerLine.indexOf(i) ? true : false }
    onClick={() => this.props.onClick(i)} />;
  }
  renderRow(row){
    let rows = [];
    for(let j = 0; j < 3; j++){
        rows.push(this.renderSquare((3 * row) + j))
    }
    return <div key={row} className="board-row">{rows}</div>
  }
  renderSquares(){
    let rows = [];
    for(let i = 0; i < 3; i++){
      rows.push(this.renderRow(i));
    }
    return rows
  }
  render() {
    return (
      <div>
        {this.renderSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      ascending: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if ((calculateWinner(squares).length > 0) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }
  handleSort(){
    this.setState({ascending: !this.state.ascending})
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }
  render() {
    const history    = this.state.history;
    const current    = history[this.state.stepNumber];
    const winnerLine = calculateWinner(current.squares)

    let status;
    if (winnerLine.length > 0) {
      status = 'Winner: ' + (!this.state.xIsNext ? 'X' : 'O');
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    let moves = history.map((step, move) => {
      const desc = move ? 'Move #' + move : 'Game start';
      return(
        <li key={move} className={ move===this.state.stepNumber ? 'active' : null }>
        <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
        );
    });
    moves = this.state.ascending ?  moves : moves.reverse();
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winnerLine={winnerLine}
          onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.handleSort()}>
            { this.state.ascending ? 'Descending' : 'Ascending' }
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return lines[i];
    }
  }
  return [];
}
