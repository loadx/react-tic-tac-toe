import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.style}
    >
    {props.value}
    </button>
  );
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for(let i=0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {player: squares[a], moves: lines[i]};
    }
  }

  return {player: null, moves: []};
}

class Board extends React.Component {
  renderSquare(i) {
    const color = (this.props.moves.includes(i)) ? "red" : "white";

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={{"backgroundColor": color}}
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
  initialState(){
    return {
      history: [{
          squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      nextPlayer: 'X',
    };
  }

  constructor(props){
    super(props);
    this.state = this.initialState();
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares).player != null || squares[i]){
      return;
    }

    squares[i] = this.state.nextPlayer;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      nextPlayer: (history.length % 2 === 0) ? 'X' : 'O',
    });
  }


  jumpTo(step){
    this.setState({
      stepNumber: step,
      nextPlayer: (step % 2 === 0) ? 'X' : 'O'
    });
  }

  reset(self){
    self.setState(self.initialState());
  }

  renderHistoryStatus(current){
    return this.state.history.map((step, move, index) =>{
      const desc = move ? `Go to move # ${move}` : `Go to game start`;
      const fontWeight = (this.state.stepNumber === move) ? "bold" : "normal";

      return (
        <li style={{"fontWeight:": fontWeight}} key={move}>
          <button style={{"fontWeight": fontWeight}} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
  }

  renderStatus(current, winner){
    const boardFilled = current.squares.filter((x) => {
        return x != null;
    });

    if(winner.player != null){
        return `winner: ${winner.player}`;
    } else {
        if(boardFilled.length !== current.squares.length){
            return `Next player is ${this.state.nextPlayer}`;
        }
    }

    return 'Draw! try again';
  }

  render() {
    const current = this.state.history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const status = this.renderStatus(current, winner);
    const moves = this.renderHistoryStatus(current);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            moves={winner.moves}
            onClick={i => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.reset(this)}>Reset game</button>
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
