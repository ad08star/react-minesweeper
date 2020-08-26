import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Cell extends Component {
  getValue = () => {
    if (!this.props.value.isRevealed) {
      return this.props.value.isFlagged ? (
        <FontAwesomeIcon icon="flag" style={{ color: "red" }} />
      ) : null;
    }
    if (this.props.value.isMine) {
      return <FontAwesomeIcon icon="bomb" />;
    }
    if (this.props.value.neighbour === 0) {
      return null;
    }
    return this.props.value.neighbour;
  };

  render() {
    let className = "cell" + (this.props.value.isRevealed ? "" : " hidden");

    return (
      <div
        ref="cell"
        onClick={this.props.onClick}
        className={className}
        onContextMenu={this.props.cMenu}
      >
        {this.getValue()}
      </div>
    );
  }
}
export default Cell;
