import React from 'react';
import ReactDOM from 'react-dom';

import HeaderButtons from './HeaderButtons';

class CSVTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      test: "No",
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
    this.clearFilter = this.clearFilter.bind(this);
    this.newApply = this.newApply.bind(this);
  }

  // Sorts or reverse sorts all the rows based on a column's data type
  sortColumn(columnNum, sortType) {
    // sort column
    // create hash
    // sort other columns

    let columnsToAddToState = {};

    let rowsToSort;
    if (this.state.filteredRows.length > 0 && this.state.columnsToFilter.length !== 0) {
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
        let parsedCell = parseFloat(rowsToSort[k][l]);
        let parsedCellLength = parsedCell.toString().length;
        let actualLength = rowsToSort[k][l].length;

        let cellIndex = rowsToSort[k][rowsToSort[k].length-1];
        if (isNaN(parsedCell) === false && parsedCellLength === actualLength) {
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

    if (sortType === 'reverse') sortedColumn = sortedColumn.reverse();

    columnsToAddToState[columnNum] = sortedColumn;

    let newState = Object.assign({}, this.state);

    for (let i = 0; i < Object.keys(columnsToAddToState).length; i++) {
      newState[i] = columnsToAddToState[i];
    }

    let sortingHash = {};
    for (let i = 1; i < rowsToSort.length; i++) {
      rowsToSort[i][columnNum] = newState[columnNum][i-1][0];

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

  // Creates the list of filter options that will populate a column's
  // filter div
  createFilterList(columnNum) {
    let newState = this.state;

    if (newState.filterDisplay === "none") {
      newState["filterDisplay"] = "block";
    } else {
      newState["filterDisplay"] = "none";
      // Add clear filter function here
    }

    let columnToCreateListFrom = [];
    if (newState.filteredRows.length === 0) {
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

    newState["filterColumn"] = columnNum;
    newState["columnsToFilter"] = newColumnsToFilter;
    newState["filterList"] = Object.keys(filterHash).sort();
    newState["filterItems"] = filterHash;

    this.setState(newState);
  }

  // Creates the div with the list of available options for a column's
  // filter
  createFilterDiv() {
    if (this.state.filterDisplay === "none") {
      return null;
    } else {
      let newState = this.state;

      function createCheckbox(item) {
        if (this.state.currentlyAppliedFilters[this.state.filterColumn][item] === true) {
          return (
            <div className="checkbox-container"
              key={item}>
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
            <div className="checkbox-container"
              key={item}>
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
        <div className="filter-div">
          <div onClick={() => this.applyFilter()}>Apply</div>
          <div onClick={() => this.clearFilter()}>Clear Filter</div>
          <div onClick={() => cancelFilter()}>Cancel</div>
          {checkboxes}
        </div>
      );
    }
  }

  // Changes the value of whether a filter will be applied based on
  // whether it is checked or not
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

  // Applies a filter to a column
  applyFilter() {
    let columnsToFilter = this.state.columnsToFilter.slice(0);
    if (Object.keys(this.state.currentlyAppliedFilters[this.state.filterColumn]).length === 0) {
      // remove column number from columnsToFilter
      columnsToFilter = columnsToFilter.filter(col => col !== this.state.filterColumn);
    }

    let newState = this.state;
    let filteredColumnCount = columnsToFilter.length;

    // Finds the IDs of rows in the column being filtered that meet the
    // filter criteria and puts those IDs in an array for later reference
    let filterIDs = [];
    for (let k = 0; k < filteredColumnCount; k++) {
      let columnNum = columnsToFilter[k];
      let column = this.state[columnNum].slice(0);

      if (k === 0) {
        for (let p = 0; p < column.length; p++) {
          if (this.state.currentlyAppliedFilters[columnNum][column[p][0]]) {
            filterIDs.push(column[p][1]);
          }
        }
      } else {
        let tempFilterIds = [];
        for (let p = 0; p < column.length; p++) {
          if (this.state.currentlyAppliedFilters[columnNum][column[p][0]] && filterIDs.includes(column[p][1])) {
            tempFilterIds.push(column[p][1]);
          }
        }
        filterIDs = tempFilterIds;
      }
    }

    let oldRows = newState.rows.slice(0);

    // Creates a new array of rows with only those who have an ID
    // in the filterIDs array
    let newRows = [];
    if (filterIDs.length !== 0) {
      newRows = oldRows.slice(0,1);
      for (let i = 1; i < oldRows.length; i++) {
        // CHANGE TO HASH FOR FASTER LOOKUP
        if (filterIDs.includes(oldRows[i][oldRows[i].length-1])) {
          newRows.push(oldRows[i]);
        }
      }
    }

    newState["filteredRows"] = newRows;
    newState["filterDisplay"] = "none";
    newState["columnsToFilter"] = columnsToFilter;
    newState["filterColumn"] = null;
    newState["filterItems"] = {};
    newState["filterList"] = [];

    this.setState(newState);

  }

  // Clears a single column's filter for easier removal of filters
  // (enhance UX)
  clearFilter() {
    let columnNum = this.state.filterColumn;
    let newState = this.state;
    newState["currentlyAppliedFilters"][columnNum] = {};
    for(let i = 0; i < newState.filterList.length; i++) {
      newState.filterItems[newState.filterList[i]] = false;
    }
    this.setState(newState);
  }

  // Clears all filters from all columns
  clearFilters() {
    let newState = this.state;
    newState["columnsToFilter"] = [];
    newState["filteredRows"] = [];
    newState["filterItems"] = {};
    newState["filterList"] = [];
    newState["filterDisplay"] = "none";
    let columnCount = Object.keys(newState["currentlyAppliedFilters"]).length;
    for (let i=0; i < columnCount; i++) {
      newState["currentlyAppliedFilters"][i] = {};
    }
    this.setState(newState);
  }

  // Changes the display for the column's stats box
  toggleShowStats(colNum) {
    let colStatsDisplay = document.getElementById('colStats' + colNum.toString()).style.display;
    if (colStatsDisplay === "") {
      document.getElementById('colStats' + colNum.toString()).style.display = "block";
    } else {
      document.getElementById('colStats' + colNum.toString()).style.display = "";
    }
  }

  // Show the box for the cell's row number on mouse over
  showRow(rowNum, rowCol) {
    if (this.state.sortingHash !== {}) {
      document.getElementById(rowNum.toString() + rowCol.toString()).style.display = "block";
    }
  }

  // Hides the box for the cell's row number on mouse out
  hideRow(rowNum, rowCol) {
    if (this.state.sortingHash !== {}) {
      document.getElementById(rowNum.toString() + rowCol.toString()).style.display = "";
    }
  }

  // Shows the box for the column's data type on mouse over
  showColDataType(colNum) {
    document.getElementById('col-header-' + colNum.toString()).style.display = "block";
  }

  // Hides the box for the column's data type on mouse out
  hideColDataType(colNum) {
    document.getElementById('col-header-' + colNum.toString()).style.display = "";
  }

  // Create the table of cells with data from the CSV
  createTable() {
    // If no CSV has been uploaded, don't create a table
    if (this.props.rows.length === 0) {
      return null;
      // When the CSV has first been uploaded, create the rows that
      // will be set in state
    } else if (this.state.rows.length === 0) {
      let newState = this.state;

      // Add row numbers to the beginning of each row array
      let rows = this.props.rows.slice(0);
      rows[0].unshift("Rows");
      for (let t = 1; t < rows.length; t++) {
        rows[t].unshift(t);
      }

      newState["rows"] = rows;

      // Identify the number of columns in the CSV data
      let columnCount = rows[0].length;
      // Create arrays for each column in state that will mimic columns
      // in a table
      for (let j = 0; j < columnCount; j++) {
        newState[j] = [];
      }

      // For each row in each column, add cell data as an element in
      // the state column's array. cellIndex is the cell's original
      // row number that is used later for sorting.
      for (let k = 1; k < this.props.rows.length; k++) {
        for (let l = 0; l < columnCount; l++) {
          let parsedCell = parseFloat(this.props.rows[k][l]);
          let parsedCellLength = parsedCell.toString().length;
          let actualLength = this.props.rows[k][l].length
          let cellIndex = k;
          if (isNaN(parsedCell) === false && parsedCellLength === actualLength) {
            newState[l].push([parsedCell, cellIndex]);
          } else {
            newState[l].push([this.props.rows[k][l], cellIndex]);
          }
          let currentlyAppliedFilters = newState["currentlyAppliedFilters"]
          currentlyAppliedFilters[l] = {};
          newState["currentlyAppliedFilters"] = currentlyAppliedFilters
        }
      }

      // Create each columns list of filter items if they don't already
      // exist. Doing this here allows for creating the list only once
      // instead of each time a column's filter button is clicked.
      let newColumnCount = newState["rows"][0].length;

      for (let c = 0; c < newColumnCount; c++) {
        let columnFilterListName = "column" + c.toString() + "FilterList";
        let columnFilterHashName = "column" + c.toString() + "FilterHash";
        let columnFilterHash = {};

        for (let r = 0; r < newState[c].length; r++) {
          let columnCellValue = newState[c][r][0];
          columnFilterHash[columnCellValue] = false;
        }
        newState[columnFilterListName] = Object.keys(columnFilterHash);
        newState[columnFilterHashName] = columnFilterHash;
      }

      this.setState(newState);
    } else {
      let rows = ["placeholder"];
      if (this.state.filteredRows.length !== 0) {
        rows = this.state.filteredRows.slice(0);
      } else if (this.state.rows.length !== 0) {
        rows = this.state.rows.slice(0);
      } else {
        rows = this.props.rows.slice(0);
      }

      let columnCount = this.state.rows[0].length;

      // This check is required when removing filters manually. If all
      // filters are removed manually, this changes "rows" from filteredRows
      // back to this.state.rows, which has all of the original rows.
      if (this.state.columnsToFilter.length === 0) {
        rows = this.state.rows;
      }

      let headers = [];
      let parsedType;
      let parsedTypeLength;

      for (let j = 0; j < columnCount; j++) {
        let colStats = [];
        if (rows === undefined) rows = this.state.rows;
        parsedType = parseFloat(rows[1][j]);
        parsedTypeLength = parsedType.toString().length;

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
          colStats.push(<span key='min'>Min: {columnInfo["min"]}</span>);
          colStats.push(<span key='max'>Max: {columnInfo["max"]}</span>);
          colStats.push(<span key='sum'>Sum: {columnInfo["sum"]}</span>);
          colStats.push(<span key='mean'>Mean: {columnInfo["mean"]}</span>);
        }

        // Determine the column's data type to display when hovering
        // over the header cell
        let colHeaderDataType;
        if (isNaN(parsedType) === false && parsedTypeLength === rows[1][j].toString().length) {
          colHeaderDataType = "Number";
        } else {
          colHeaderDataType = "String";
        }

        // Create column header cell with filter and sort buttons
        headers.push(
          <span key={j} className="col-header-cell"
          onMouseOver={() => this.showColDataType(j)}
          onMouseLeave={() => this.hideColDataType(j)}>
            <span className="header-title">{rows[0][j]}</span>
            <span className="col-data-type"
              id={"col-header-" + j.toString()}
              >Column Data Type: {colHeaderDataType}</span>
            <div className="sort-buttons-div">
              <div className="sort-button"
                onClick={() => this.toggleShowStats(j)}
                >Stats</div>
              <HeaderButtons
                columnNum={j}
                column={this.state[j]}
                columnFilterList={this.state[`column${j}FilterList`].sort()}
                columnFilterHash={this.state[`column${j}FilterHash`]}
                filterColumn={this.state.filterColumn}
                columnsToFilter={this.state.columnsToFilter}
                filterItems={this.state.filterItems}
                filterList={this.state.filterList}
                currentlyAppliedFilters={this.state.currentlyAppliedFilters}
                filteredRows={this.state.filteredRows}
                rows={this.state.rows}
                newApply={this.newApply}
                />
              <div id={"colStats" + j.toString()} className="column-stats">
                <span key={j.toString()}>Column Stats</span>
                <span key={j.toString() + 'rows'}>Rows: {columnInfo["count"]}</span>
                <span key={j.toString() + 'nERows'}>Non Empty Rows: {columnInfo["nonBlankRows"]}</span>
                {colStats}
              </div>
            </div>
          </span>
        );
      }

      // Function for creating individual non-header rows
      function createRow(i) {
        let row = [];
        for (let k = 0; k < columnCount; k++) {
          row.push(
            <span key={i.toString() + k.toString()} onMouseOver={() => this.showRow(i, k)}
              onMouseLeave={() => this.hideRow(i, k)}>{rows[i][k]}
              <span className="row-num" id={i.toString() + k.toString()}>Current Row: {i}</span>
            </span>
          );
        }
        return row;
      }
      createRow = createRow.bind(this);

      // Create rows
      let i = -1;
      let lineWidth = (200 * columnCount).toString() + "px"; // Set width of li
      return rows.map(row => {
        i += 1;
        if (i === 0) {
          // Create column headers
          return (
            <li key={i} style={{"width": lineWidth}}>
              {headers}
            </li>);
        } else {
          // Create all regular rows
          return (
            <li key={i} style={{"width": lineWidth}}>
              {createRow(i)}
            </li>);
        }
      });
    }
  }

  newApply(colNum, colFilterList) {
    let num = colNum;
    let filterList = colFilterList;
    console.log("Setting parent state");
    debugger
    this.setState({
      test: 'YES',
      rows: []
    });
  }

  render() {
    console.log(this.state);
    let clearFiltersStyle = this.props.rows.length === 0 ? "none" : "inline-block";

    return (
      <div className="table-div">
        <button style={{"display": clearFiltersStyle}} onClick={() => this.clearFilters()}>Clear Filters</button>
        <div>
          {this.createFilterDiv()}

        </div>
        <ul className="table-ul">
          {this.createTable()}
        </ul>
      </div>
    );
  }

}

export default CSVTable;
