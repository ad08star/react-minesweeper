import React, { Component } from "react";
import Cell from "../Cells/Cell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Timer from "../Timer/Timer";

class Board extends Component {
  state = {
    boardData: this.createBoard(
      this.props.height,
      this.props.width,
      this.props.mines
    ),
    gameWon: false,
    mineCount: this.props.mines,
    startTimer: false,
    time: 0,
    showSadface: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState(
        {
          boardData: this.createBoard(
            nextProps.height,
            nextProps.width,
            nextProps.mines
          ),
          gameWon: false,
          startTimer: false,
          time: 0,
          showSadface: false,
          mineCount: nextProps.mines,
        },
        this.stopTimer()
      );
    }
  }

  startTimer() {
    this.timer = setInterval(
      () =>
        this.setState({
          time: this.state.time + 1,
        }),
      1000
    );
  }

  stopTimer() {
    this.setState({ startTimer: false });
    clearInterval(this.timer);
  }

  getTypeArray(data, property) {
    let tempArray = [];

    data.forEach((datarow) => {
      datarow.forEach((dataitem) => {
        if (dataitem[property]) {
          tempArray.push(dataitem);
        }
      });
    });

    return tempArray;
  }

  getHidden(data) {
    let mineArray = [];

    data.forEach((datarow) => {
      datarow.forEach((dataitem) => {
        if (!dataitem.isRevealed) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  }

  createBoard(height, width, mines) {
    let data = [];

    for (let i = 0; i < height; i++) {
      data.push([]);
      for (let j = 0; j < width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }
    //planting mines
    for (let i = 0; i < mines; i++) {
      let randomx = Math.floor(Math.random() * height);
      let randomy = Math.floor(Math.random() * width);
      if (data[randomx][randomy].isMine) {
        i--;
      } else {
        data[randomx][randomy].isMine = true;
      }
    }

    data = this.getNeighbours(data, height, width);
    return data;
  }

  getNeighbours(data, height, width) {
    let updatedData = data;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (data[i][j].isMine !== true) {
          let mine = 0;
          const adjacentCells = this.traverseBoard(
            data[i][j].x,
            data[i][j].y,
            data
          );
          adjacentCells.forEach((value) => {
            if (value && value.isMine) {
              mine++;
            }
          });
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbour = mine;
        }
      }
    }

    return updatedData;
  }

  traverseBoard(x, y, data) {
    const el = [];

    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    if (x < this.props.height - 1) {
      el.push(data[x + 1][y]);
    }

    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    if (y < this.props.width - 1) {
      el.push(data[x][y + 1]);
    }

    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    if (x > 0 && y < this.props.width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    if (x < this.props.height - 1 && y < this.props.width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    if (x < this.props.height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  }

  revealBoard() {
    let updatedData = this.state.boardData;
    updatedData.forEach((dataRow) => {
      dataRow.forEach((dataCol) => {
        dataCol.isRevealed = true;
      });
    });
    this.setState({
      boardData: updatedData,
      startTimer: false,
    });
  }

  revealEmpty(x, y, data) {
    let adjacentCells = this.traverseBoard(x, y, data);
    adjacentCells.forEach((value) => {
      if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          this.revealEmpty(value.x, value.y, data);
        }
      }
    });
    return data;
  }

  handleCellClick(x, y) {
    if (!this.state.startTimer) {
      this.setState({ startTimer: true }, () => {
        this.startTimer();
      });
    }

    let win = false;

    if (this.state.boardData[x][y].isRevealed) return null;

    if (this.state.boardData[x][y].isMine) {
      this.revealBoard();
      this.stopTimer();
      this.setState({ showSadface: true });
      alert("You lose");
    }

    let updatedData = this.state.boardData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = this.revealEmpty(x, y, updatedData);
    }

    if (this.getHidden(updatedData).length === this.props.mines) {
      win = true;
      this.revealBoard();
      this.stopTimer();
      alert("You Win");
    }

    this.setState({
      boardData: updatedData,
      mineCount:
        this.props.mines - this.getTypeArray(updatedData, "isFlagged").length,
      gameWon: win,
    });
  }

  handleContextMenu(e, x, y) {
    e.preventDefault();
    if (!this.state.startTimer) {
      this.setState({ startTimer: true }, () => {
        this.startTimer();
      });
    }
    let updatedData = this.state.boardData;
    let mines = this.state.mineCount;
    let win = false;

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }
    if (updatedData[x][y].isRevealed) return;

    if (mines === 0) {
      const mineArray = this.getTypeArray(updatedData, "isMine");
      const FlagArray = this.getTypeArray(updatedData, "isFlagged");
      win = JSON.stringify(mineArray) === JSON.stringify(FlagArray);
      if (win) {
        this.revealBoard();
        this.stopTimer();
        alert("You Win");
      }
    }

    this.setState({
      boardData: updatedData,
      mineCount: mines,
      gameWon: win,
    });
  }

  renderBoard(data) {
    return data.map((dataRow) => {
      return dataRow.map((dataCell) => {
        return (
          <div key={dataCell.x * dataRow.length + dataCell.y}>
            <Cell
              onClick={() => this.handleCellClick(dataCell.x, dataCell.y)}
              cMenu={(e) => this.handleContextMenu(e, dataCell.x, dataCell.y)}
              value={dataCell}
            />
            {dataRow[dataRow.length - 1] === dataCell ? (
              <div className="clear" />
            ) : (
              ""
            )}
          </div>
        );
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          <span>Mines: {this.state.mineCount}</span>
          <span className="pr-5 pl-5" onClick={this.props.onClick}>
            <FontAwesomeIcon
              icon={!this.state.showSadface ? "smile" : "frown"}
              style={{ color: "yellow" }}
            />
          </span>
          <span>
            <Timer time={this.state.time} />
          </span>
        </div>
        <div>{this.renderBoard(this.state.boardData)}</div>
      </div>
    );
  }
}
export default Board;
