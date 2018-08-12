import React from 'react';
import ReactDOM from 'react-dom';

class CSVTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      filterDisplay: "none",
      filterColumn: null,
      columnsToFilter: [],
      filterItems: {},
      filterList: [],
      currentlyAppliedFilters: {},
      filteredRows: [],
      sortingHash: {}
    };
    this.changeFilterItemValue = this.changeFilterItemValue.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  sortColumn(columnNum) {
    // sort column
    // create hash
    // sort other columns

    let columnsToAddToState = {};

    let rowsToSort;
    if (this.state.filteredRows.length > 0) {
      rowsToSort = this.state.filteredRows;
    } else {
      rowsToSort = this.props.rows;
    }

    let columnCount = this.props.rows[0].length;
    for (let j = 0; j < columnCount; j++) {
      columnsToAddToState[j] = [];
    }
    for (let k = 1; k < rowsToSort.length; k++) {
      for (let l = 0; l < columnCount; l++) {
        let parsedCell = parseInt(rowsToSort[k][l]);
        // Poss -1 change
        let cellIndex = rowsToSort[k][rowsToSort[k].length-1];
        if (isNaN(parsedCell) === false) {
          columnsToAddToState[l].push([parsedCell, cellIndex]);
        } else {
          columnsToAddToState[l].push([rowsToSort[k][l], cellIndex]);
        }
      }
    }

    let colDataType = parseInt(rowsToSort[1][columnNum]);
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

    let sortingHash = {};
    for (let i = 1; i < rowsToSort.length; i++) {
      rowsToSort[i][columnNum] = newState[columnNum][i-1][0];
      // Poss -1 change
      sortingHash[newState[columnNum][i-1][newState[columnNum][i-1].length-1]] = i;
    }
    newState["sortingHash"] = sortingHash;

    for (let i = 0; i < columnCount; i++) {
      if (i !== columnNum) {
        let newColumn = [];
        for (let j = 1; j < rowsToSort.length; j++) {
          let cell = columnsToAddToState[i][j-1];
          let index = cell[1];
          let value = cell[0];
          newColumn[sortingHash[index]-1] = cell;
          rowsToSort[sortingHash[index]][i] = value;
          rowsToSort[sortingHash[index]][columnCount] = index;
        }
        newState[i] = newColumn;
      }
    }

    this.setState(newState);
  }

  reverseSortColumn(columnNum) {
    let columnsToAddToState = {};

    let rowsToSort;
    if (this.state.filteredRows.length > 0) {
      rowsToSort = this.state.filteredRows;
    } else {
      rowsToSort = this.props.rows;
    }

    let columnCount = this.props.rows[0].length;
    for (let j = 0; j < columnCount; j++) {
      columnsToAddToState[j] = [];
    }
    for (let k = 1; k < rowsToSort.length; k++) {
      for (let l = 0; l < columnCount; l++) {
        let parsedCell = parseInt(rowsToSort[k][l]);
        // Poss -1 change
        let cellIndex = rowsToSort[k][rowsToSort[k].length-1];
        if (isNaN(parsedCell) === false) {
          columnsToAddToState[l].push([parsedCell, cellIndex]);
        } else {
          columnsToAddToState[l].push([rowsToSort[k][l], cellIndex]);
        }
      }
    }

    let colDataType = parseInt(rowsToSort[1][columnNum]);
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

    let sortingHash = {};
    for (let i = 1; i < rowsToSort.length; i++) {
      rowsToSort[i][columnNum] = newState[columnNum][i-1][0];
      // Poss -1 change
      sortingHash[newState[columnNum][i-1][newState[columnNum][i-1].length-1]] = i;
    }

    for (let i = 0; i < columnCount; i++) {
      if (i !== columnNum) {
        let newColumn = [];
        for (let j = 1; j < rowsToSort.length; j++) {
          let cell = columnsToAddToState[i][j-1];
          let index = cell[1];
          let value = cell[0];
          newColumn[sortingHash[index]-1] = cell;
          rowsToSort[sortingHash[index]][i] = value;
          rowsToSort[sortingHash[index]][columnCount] = index;
        }
        newState[i] = newColumn;
      }
    }

    this.setState(newState);
  }

  // May need to separate functions out and have a parent function
    // Open modal
    // Create list
    // Change state
    // Apply-close or close-clear modal
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
      // Add clear filter function here
    }
    let columnToCreateListFrom = [];
    if (this.state.filteredRows.length === 0) {
      columnToCreateListFrom = this.state[columnNum];
    } else {
      for (let i = 1; i < this.state.filteredRows.length; i++) {
        columnToCreateListFrom.push(this.state.filteredRows[i][columnNum]);
      }
    }

    let filterHash = {};
    for (let i = 0; i < columnToCreateListFrom.length; i++) {
      let val;
      let actualVal;
      if (this.state.filteredRows.length > 0) {
        actualVal = columnToCreateListFrom[i];
      } else {
        val = (columnToCreateListFrom[i]);
        actualVal = val[0];
      }
      if (this.state.currentlyAppliedFilters[columnNum][actualVal] === true) {
        filterHash[ actualVal ] = true;
      } else {filterHash[ actualVal ] = false;}
    }

    let newColumnsToFilter = this.state.columnsToFilter.slice(0);
    if (!newColumnsToFilter.includes(columnNum)) newColumnsToFilter.push(columnNum);

    this.setState({
      filterColumn: columnNum,
      columnsToFilter: newColumnsToFilter,
      filterList: Object.keys(filterHash),
      filterItems: filterHash
    });
  }

  createFilter() {
    if (this.state.filterDisplay === "none") {
      return null;
    } else {
      // can change below line to this.state.filterList[colNum].map
      let newState = this.state;

      function createCheckbox(item) {
        if (this.state.currentlyAppliedFilters[this.state.filterColumn][item] === true) {
          return (
            <div className="checkbox-container">
              <input id={item}
                className="checkbox"
                type="checkbox"
                value={item}
                onChange={this.changeFilterItemValue}
                checked
              />
              <label>{item}</label>
            </div>
          );
        } else {
          return (
            <div className="checkbox-container">
              <input id={item}
                className="checkbox"
                type="checkbox"
                value={item}
                onChange={this.changeFilterItemValue}
              />
              <label>{item}</label>
            </div>
          );
        }
      }
      createCheckbox = createCheckbox.bind(this);

      let checkboxes = this.state.filterList.map(item => createCheckbox(item));

      function cancelFilter() {
        this.setState({
          filterDisplay: "none"
        });
      }
      cancelFilter = cancelFilter.bind(this);

      return (
        <div>
          <div onClick={() => this.applyFilter()}>Apply</div>
          <div onClick={() => cancelFilter()}>Cancel</div>
          {checkboxes}
        </div>
      );
    }
  }

  // (Complete) Have filter hash in state with values being true or false
  // (Complete) Checking a checkbox makes filter value true, unchecking makes it false
  // (Complete) Have a function that on change take e.target.value or something and changes
    // filter hash in state
  // (Complete) When apply is clicked it runs the function that goes through the column looking
    // for values in the filter hash that have true
    // Have a blank "column/columns" that we push values into, then set main columns with new
    // columns
    // Maybe preserve original
  //

  changeFilterItemValue(e) {
    let filterItem = e.target.value;
    let filterItems = this.state.filterItems;
    let filterColumn = this.state.filterColumn
    let currentlyAppliedFiltersCol = this.state.currentlyAppliedFilters[filterColumn];
    if (filterItems[filterItem] === true) {
      filterItems[filterItem] = false;
      delete currentlyAppliedFiltersCol[filterItem];
    } else {
      filterItems[filterItem] = true;
      currentlyAppliedFiltersCol[filterItem] = true;
    }
    let currentlyAppliedFilters = this.state.currentlyAppliedFilters;
    currentlyAppliedFilters[filterColumn] = currentlyAppliedFiltersCol;
    this.setState({
      filterItems: filterItems,
      currentlyAppliedFilters: currentlyAppliedFilters
    });
  }

  applyFilter() {
    let columnsToFilter = this.state.columnsToFilter.slice(0);
    if (Object.keys(this.state.currentlyAppliedFilters[this.state.filterColumn]).length === 0) {
      // remove column number from columnsToFilter
      columnsToFilter = columnsToFilter.filter(col => col !== this.state.filterColumn);
    }

    let filterIDs;
    let newState = this.state;

    let filteredColumnCount = columnsToFilter.length;
    let newFilterIds = [];
    for (let k = 0; k < filteredColumnCount; k++) {
      let columnNum = columnsToFilter[k];
      let column = this.state[columnNum].slice(0);

      if (k === 0) {
        for (let p = 0; p < column.length; p++) {
          if (this.state.currentlyAppliedFilters[columnNum][column[p][0]]) {
            newFilterIds.push(column[p][1]);
          }
        }
      } else {
        let tempFilterIds = [];
        for (let p = 0; p < column.length; p++) {
          if (this.state.currentlyAppliedFilters[columnNum][column[p][0]] && newFilterIds.includes(column[p][1])) {
            tempFilterIds.push(column[p][1]);
          }
        }
        newFilterIds = tempFilterIds;
      }
      console.log(newFilterIds);
    }

    let oldRows;
    // if (this.state.filteredRows.length !== 0) {
    //   oldRows = this.state.filteredRows
    // } else {
    oldRows = newState.rows.slice(0);
    // }

    let newRows = oldRows.slice(0,1);

    for (let i = 1; i < oldRows.length; i++) {
      // CHANGE TO HASH FOR FASTER LOOKUP
      // Poss -1 change
      if (newFilterIds.includes(oldRows[i][oldRows[i].length-1])) {
        newRows.push(oldRows[i]);
      }
    }

    newState["filteredRows"] = newRows;
    newState["filterDisplay"] = "none";
    newState["columnsToFilter"] = columnsToFilter;

    this.setState(newState);

  }
  // filterItems in state might need to have more content, i.e. a row for each column already
  // so that as filters are removed the apply filter function can look at remaining filters and
  // keep those in place
    // might need to reference an array of which filters are in place, i.e. that thought I had
    // of having this.state.filterColumn be an array
    // applyFilter would push column into array, removeFilter would remove it

  clearFilters() {
    let newState = this.state;
    newState["columnsToFilter"] = [];
    newState["filteredRows"] = [];
    let columnCount = Object.keys(newState["currentlyAppliedFilters"]).length;
    for (let i=0; i < columnCount; i++) {
      newState["currentlyAppliedFilters"][i] = {};
    }
    this.setState(newState);
  }

  toggleShowStats(colNum) {
    let colStatsDisplay = document.getElementById('colStats' + colNum.toString()).style.display;
    if (colStatsDisplay === "") {
      document.getElementById('colStats' + colNum.toString()).style.display = "block";
    } else {
      document.getElementById('colStats' + colNum.toString()).style.display = "";
    }
  }

  showRow(rowNum, rowCol) {
    if (this.state.sortingHash !== {}) {
      document.getElementById(rowNum.toString() + rowCol.toString()).style.display = "block";
    }
  }

  hideRow(rowNum, rowCol) {
    if (this.state.sortingHash !== {}) {
      document.getElementById(rowNum.toString() + rowCol.toString()).style.display = "";
    }
  }

  showColDataType(colNum) {
    document.getElementById('col-header-' + colNum.toString()).style.display = "block";
  }

  hideColDataType(colNum) {
    document.getElementById('col-header-' + colNum.toString()).style.display = "";
  }

  createRows() {
    if (this.props.rows.length === 0) {
      return null;
    } else if (this.state.rows.length === 0) {
      let newState = this.state;
      // let columnsToAddToState = {};

      let columnCount = this.props.rows[0].length;
      for (let j = 0; j < columnCount; j++) {
        newState[j] = [];
      }
      for (let k = 1; k < this.props.rows.length; k++) {
        for (let l = 0; l < columnCount; l++) {
          let parsedCell = parseInt(this.props.rows[k][l]);
          let cellIndex = k;
          if (isNaN(parsedCell) === false) {
            newState[l].push([parsedCell, cellIndex]);
          } else {
            newState[l].push([this.props.rows[k][l], cellIndex]);
          }
          let currentlyAppliedFilters = newState["currentlyAppliedFilters"]
          currentlyAppliedFilters[l] = {};
          newState["currentlyAppliedFilters"] = currentlyAppliedFilters
        }
      }
      newState["rows"] = this.props.rows;
      // Can add keys here
      for (let t = 1; t < this.props.rows.length; t++) {
        newState["rows"][t].unshift(t);
      }
      this.setState(newState);
    } else {
      // Have new rows
      let rows;
      // Maybe here the first if-else statement needs to be
      // if this.state.filteredRows.length !== 0 for keeping
      // separation between original rows and filtered ones
      if (this.state.filteredRows.length !== 0) {
        rows = this.state.filteredRows
      } else if (this.state.rows.length !== 0) {
        rows = this.state.rows;
      } else {
        rows = this.props.rows;
      }
      if (rows[0][0] !== "Row") rows[0].unshift("Row");
      if (!rows[1]) rows[1].unshift(1);

      let columnCount = rows[0].length;

      // Might have to come after rows are updated with key
      let headers = [];
      let parsedType;
      let parsedTypeLength;
      for (let j = 0; j < columnCount; j++) {
        let colStats = [];
        parsedType = parseFloat(rows[1][j]);
        parsedTypeLength = parsedType.toString().length;
        // Poss -1 change
        let columnInfo = {
          "count": rows.length-1,
          "nonBlankRows": 0,
          "min": 0,
          "max": 0,
          "mean": 0,
          "sum": 0
        };
        let lengthToCheck = rows[1][j].toString().length;

        let columnNonBlankRowCount = 0;
        for (let q = 1; q < rows.length; q++) {
          if (rows[q][j] !== "") columnNonBlankRowCount += 1;
        }
        columnInfo["nonBlankRows"] = columnNonBlankRowCount;

        if (isNaN(parsedType) === false && parsedTypeLength === rows[1][j].toString().length) {

          for (let p = 1; p < rows.length; p++) {
            if (parseFloat(rows[p][j]) < columnInfo["min"]) columnInfo["min"] = parseFloat(rows[p][j])
            if (parseFloat(rows[p][j]) > columnInfo["max"]) columnInfo["max"] = parseFloat(rows[p][j])
            columnInfo["sum"] += parseFloat(rows[p][j]);
          }
          columnInfo["mean"] = (columnInfo["sum"] / columnInfo["count"]);

          columnInfo["sum"] = columnInfo["sum"].toFixed(2);
          columnInfo["min"] = columnInfo["min"].toFixed(2);
          columnInfo["max"] = columnInfo["max"].toFixed(2);
          columnInfo["mean"] = columnInfo["mean"].toFixed(2);
          colStats.push(<span>Min: {columnInfo["min"]}</span>);
          colStats.push(<span>Max: {columnInfo["max"]}</span>);
          colStats.push(<span>Sum: {columnInfo["sum"]}</span>);
          colStats.push(<span>Mean: {columnInfo["mean"]}</span>);
        }

        let colHeaderDataType;
        if (isNaN(parsedType) === false && parsedTypeLength === rows[1][j].toString().length) {
          colHeaderDataType = "Number";
        } else {
          colHeaderDataType = "String";
        }

        // Create column header span with filter and sort buttons
        headers.push(
          <span onMouseOver={() => this.showColDataType(j)}
          onMouseLeave={() => this.hideColDataType(j)}>{rows[0][j]}
            <span className="col-data-type"
              id={"col-header-" + j.toString()}
              >Column Data Type: {colHeaderDataType}</span>
            <div className="sort-buttons-div">
              <div className="sort-button"
                onClick={() => this.toggleShowStats(j)}
                >Stats</div>
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
              <div id={"colStats" + j.toString()} className="column-stats">
                <span>Column Stats</span>
                <span>Rows: {columnInfo["count"]}</span>
                <span>Non Empty Rows: {columnInfo["nonBlankRows"]}</span>
                {colStats}
              </div>
            </div>
          </span>
        );
      }

      function createRow(i) {
        let row = [];
        for (let k = 0; k < columnCount; k++) {
          row.push(
            <span onMouseOver={() => this.showRow(i, k)}
              onMouseLeave={() => this.hideRow(i, k)}>{rows[i][k]}
              <span className="row-num" id={i.toString() + k.toString()}>Current Row: {i}</span>
            </span>
          );
        }
        return row;
      }
      createRow = createRow.bind(this);

      let i = -1;
      return rows.map(row => {
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
        <button onClick={() => this.clearFilters()}>Clear Filters</button>
        <div>{this.createFilter()}</div>
        <ul>
          {this.createRows()}
        </ul>
      </div>
    );
  }

}

export default CSVTable;
