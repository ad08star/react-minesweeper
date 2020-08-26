import React, { Component } from "react";
import "./App.css";
import Board from "./components/Board/Board";
import { Row, Col, Button } from "react-bootstrap";

class App extends Component {
  state = {
    height: 10,
    width: 10,
    mines: 10,
    userWidth: 10,
    userHeight: 10,
    userMine: 10,
  };
  handleRowInput = (e) => {
    this.setState({ userHeight: parseInt(e.target.value) });
  };

  handleColInput = (e) => {
    this.setState({ userWidth: parseInt(e.target.value) });
  };
  handleMineInput = (e) => {
    this.setState({ userMine: parseInt(e.target.value) });
  };

  handleCustomGame = () => {
    if (this.state.userMine >= this.state.userHeight * this.state.userWidth) {
      alert(
        "Number of mines should be less then " +
          this.state.userHeight * this.state.userWidth
      );
    } else
      this.setState({
        width: this.state.userWidth,
        height: this.state.userHeight,
        mines: this.state.userMine,
      });
  };

  render() {
    const {
      height,
      width,
      mines,
      userWidth,
      userHeight,
      userMine,
    } = this.state;
    return (
      <div className="game">
        <h2 className="text-center">Minesweeper</h2>
        <Row className="justify-content-md-center mt-3">
          <Col xs lg="2">
            <label>Enter Rows</label>
            <input
              type="number"
              onChange={this.handleRowInput}
              value={userHeight}
            ></input>
          </Col>
          <Col xs lg="2">
            <label>Enter Columns</label>
            <input
              type="number"
              onChange={this.handleColInput}
              value={userWidth}
            ></input>
          </Col>
          <Col xs lg="2">
            <label>Enter number of Mines</label>
            <input
              type="number"
              onChange={this.handleMineInput}
              value={userMine}
            ></input>
          </Col>
        </Row>
        <Row className="justify-content-md-center mt-2">
          <Col xs lg="2">
            <Button onClick={this.handleCustomGame}>Start Custom Game</Button>
          </Col>
        </Row>
        <div className="pl-5">
          <Board
            height={height}
            width={width}
            mines={mines}
            onClick={this.handleCustomGame}
          />
        </div>
      </div>
    );
  }
}

export default App;
