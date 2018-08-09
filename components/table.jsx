import React from 'react';
import ReactDOM from 'react-dom';

class CSVTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: this.props.rows
    };
  }

  sortColumn(columnNum) {
    // sort column
    // create hash
    // sort other columns

    let columnsToAddToState = {};
    let columnCount = this.props.rows[0].length;
    for (let j = 0; j < columnCount; j++) {
      columnsToAddToState[j] = [];
    }
    for (let k = 1; k < this.props.rows.length; k++) {
      for (let l = 0; l < columnCount; l++) {
        let parsedCell = parseInt(this.props.rows[k][l]);
        if (isNaN(parsedCell) === false) {
          columnsToAddToState[l].push(parsedCell);
        } else {
          columnsToAddToState[l].push(this.props.rows[k][l]);
        }
      }
    }

    let colDataType = parseInt(this.props.rows[1][columnNum]);
    let sortedColumn;

    if (isNaN(colDataType) === true) {
      sortedColumn = columnsToAddToState[columnNum].slice(0).sort();
    } else {
      sortedColumn = columnsToAddToState[columnNum].slice(0).sort(function(a,b) {
        return a-b;
      });
    }

    columnsToAddToState[columnNum] = sortedColumn;
    console.log(columnsToAddToState);

    let newState = Object.assign({}, this.state);

    for (let i = 0; i < Object.keys(columnsToAddToState).length; i++) {
      newState[i] = columnsToAddToState[i];
    }

    newState.rows = this.props.rows;
    for (let i = 1; i < this.props.rows.length; i++) {
      newState.rows[i][columnNum] = newState[columnNum][i-1];
    }
    this.setState(newState);
  }

  createTestLines() {
    // GOING TO NEED SOMETHING TO KNOW HOW MANY SPANS
    // TO CREATE FOR EACH COLUMN
    // LIKE HAVE A COLUMNSCOUNT VARIABLE THAT COUNTS THE
    // LENGTH OF ANY ROW, AND THEN HAVE A FUNCTION THAT
    // GENERATES SPAN FOR EACH COUNT, WITH AN I COUNTER
    // FILL IN THE ROW[I], i.e. the array's elements/cell
    // info
    if (this.props.rows.length === 0) {
      return null;
    } else {
      // Have new rows
      let i = -1;
      return this.props.rows.map(row => {
        i += 1;
        if (i === 0) {
          return (
            <li key={i}>
              <span>{row[0]}<div
                className="sort-button"
                onClick={() => this.sortColumn(0)}
                >Sort</div></span>
              <span>{row[1]}<div
                className="sort-button"
                onClick={() => this.sortColumn(1)}
                >Sort</div></span>
            </li>);
        } else {
          return (
            <li key={i}>
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </li>);
        }
      });
    }
  }

  render() {
    console.log(this.props.rows);
    console.log(this.state);
    return (
      <div>
        <div>The Table</div>
        <ul>
          {this.createTestLines()}
        </ul>
      </div>
    );
  }

}

export default CSVTable;
