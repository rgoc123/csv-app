import React from 'react';
import ReactDOM from 'react-dom';

class CSVTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: this.props.rows,
      filterDisplay: "none",
      filterItems: []
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
        let cellIndex = this.props.rows[k][this.props.rows[k].length-1];
        if (isNaN(parsedCell) === false) {
          columnsToAddToState[l].push([parsedCell, cellIndex]);
        } else {
          columnsToAddToState[l].push([this.props.rows[k][l], cellIndex]);
        }
      }
    }

    let colDataType = parseInt(this.props.rows[1][columnNum]);
    let sortedColumn;

    if (isNaN(colDataType) === true) {
      sortedColumn = columnsToAddToState[columnNum].slice(0).sort();
    } else {
      sortedColumn = columnsToAddToState[columnNum].slice(0).sort(function(a,b) {
        return a[0]-b[0];
      });
    }

    columnsToAddToState[columnNum] = sortedColumn;

    let newState = Object.assign({}, this.state);

    for (let i = 0; i < Object.keys(columnsToAddToState).length; i++) {
      newState[i] = columnsToAddToState[i];
    }

    newState.rows = this.props.rows;
    let sortingHash = {};
    for (let i = 1; i < this.props.rows.length; i++) {
      newState.rows[i][columnNum] = newState[columnNum][i-1][0];
      sortingHash[newState[columnNum][i-1][newState[columnNum][i-1].length-1]] = i;
    }

    for (let i = 0; i < columnCount; i++) {
      if (i !== columnNum) {
        let newColumn = [];
        for (let j = 1; j < this.props.rows.length; j++) {
          let cell = columnsToAddToState[i][j-1];
          let index = cell[1];
          let value = cell[0];
          newColumn[sortingHash[index]-1] = cell;
          newState.rows[sortingHash[index]][i] = value;
          newState.rows[sortingHash[index]][columnCount] = index;
        }
        // for (let k = 0; k < newColumn.length; k++) {
        //   newState.rows[i] = newColumn[k];
        // }
        newState[i] = newColumn;
      }
    }

    this.setState(newState);
  }

  reverseSortColumn(columnNum) {
    let columnsToAddToState = {};
    let columnCount = this.props.rows[0].length;
    for (let j = 0; j < columnCount; j++) {
      columnsToAddToState[j] = [];
    }
    for (let k = 1; k < this.props.rows.length; k++) {
      for (let l = 0; l < columnCount; l++) {
        let parsedCell = parseInt(this.props.rows[k][l]);
        let cellIndex = this.props.rows[k][this.props.rows[k].length-1];
        if (isNaN(parsedCell) === false) {
          columnsToAddToState[l].push([parsedCell, cellIndex]);
        } else {
          columnsToAddToState[l].push([this.props.rows[k][l], cellIndex]);
        }
      }
    }

    let colDataType = parseInt(this.props.rows[1][columnNum]);
    let sortedColumn;

    if (isNaN(colDataType) === true) {
      sortedColumn = columnsToAddToState[columnNum].slice(0).sort();
      sortedColumn = sortedColumn.reverse();
    } else {
      sortedColumn = columnsToAddToState[columnNum].slice(0).sort(function(a,b) {
        return a[0]-b[0];
      });
      sortedColumn = sortedColumn.reverse();
    }

    columnsToAddToState[columnNum] = sortedColumn;

    let newState = Object.assign({}, this.state);

    for (let i = 0; i < Object.keys(columnsToAddToState).length; i++) {
      newState[i] = columnsToAddToState[i];
    }

    newState.rows = this.props.rows;
    let sortingHash = {};
    for (let i = 1; i < this.props.rows.length; i++) {
      newState.rows[i][columnNum] = newState[columnNum][i-1][0];
      sortingHash[newState[columnNum][i-1][newState[columnNum][i-1].length-1]] = i;
    }

    for (let i = 0; i < columnCount; i++) {
      if (i !== columnNum) {
        let newColumn = [];
        for (let j = 1; j < this.props.rows.length; j++) {
          let cell = columnsToAddToState[i][j-1];
          let index = cell[1];
          let value = cell[0];
          newColumn[sortingHash[index]-1] = cell;
          newState.rows[sortingHash[index]][i] = value;
          newState.rows[sortingHash[index]][columnCount] = index;
        }
        // for (let k = 0; k < newColumn.length; k++) {
        //   newState.rows[i] = newColumn[k];
        // }
        newState[i] = newColumn;
      }
    }

    this.setState(newState);
  }

  createFilterList(columnNum) {
    this.setState({
      rows: this.props.rows
    });
    if (this.state.filterDisplay === "none") {
      this.setState({
        filterDisplay: "block"
      });
    } else {
      this.setState({
        filterDisplay: "none"
      });
    }
    let filterHash = {};
    for (let i = 1; i < this.props.rows.length-1; i++) {
      let val = (this.state[columnNum][i]);
      let actualVal = val[0];
      console.log(val);
      filterHash[ actualVal ] = true;
    }

    this.setState({
      filterItems: Object.keys(filterHash)
    });
  }

  createFilter() {
    if (this.state.filterDisplay === "none") {
      return null;
    } else {
      let checkboxes = this.state.filterItems.map(item => {
        return (
          <div className="checkbox-container">
            <input className="checkbox" type="checkbox" value={item}
            />
          <label>{item}</label>
          </div>
        )
      })
      return (
        <div>
          {checkboxes}
        </div>
      );
    }
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
      let columnCount = this.props.rows[0].length;

      let headers = [];
      for (let j = 0; j < columnCount; j++) {
        headers.push(
          <span>{this.props.rows[0][j]}
            <div className="sort-buttons-div">
              <div
                className="sort-button"
                onClick={() => this.createFilterList(j)}
                >Filter</div>
              <div
                className="sort-button"
                onClick={() => this.sortColumn(j)}
                >Sort</div>
              <div
                className="sort-button"
                onClick={() => this.reverseSortColumn(j)}
                >Reverse</div>
            </div>
          </span>
        );
      }

      // let rows = [];
      // for (let k = 0; k < columnCount; k++) {
      //   rows.push(<span>{row[0]}</span>);
      // }
      function createRow(i) {
        let row = [];
        for (let k = 0; k < columnCount; k++) {
          row.push(<span>{this.props.rows[i][k]}</span>);
        }
        return row;
      }
      createRow = createRow.bind(this);

      let i = -1;
      return this.props.rows.map(row => {
        i += 1;
        if (i === 0) {
          return (
            <li key={i}>
              {headers}
            </li>);
        } else {
          return (
            <li key={i}>
              {createRow(i)}
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
        <div>{this.createFilter()}</div>
        <ul>
          {this.createTestLines()}
        </ul>
      </div>
    );
  }

}

export default CSVTable;
