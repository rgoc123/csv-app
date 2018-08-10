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
      filteredRows: []
    };
    this.changeFilterItemValue = this.changeFilterItemValue.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
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

    let filterHash = {};
    for (let i = 1; i < this.props.rows.length-1; i++) {
      let val = (this.state[columnNum][i]);
      let actualVal = val[0];
      if (this.state.currentlyAppliedFilters[columnNum][actualVal] === true) {
        filterHash[ actualVal ] = true;
      } else {filterHash[ actualVal ] = false;}
    }

    let newColumnsToFilter = this.state.columnsToFilter.slice(0);
    newColumnsToFilter.push(columnNum);

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

      return (
        <div>
          {checkboxes}
          <div onClick={() => this.applyFilter()}>Apply</div>
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

    let filterIDs;
    for (let i = 0; i < columnsToFilter.length; i++) {
      let columnToFilter = this.state[columnsToFilter[i]].slice(0);
      let oldColumn = columnToFilter;
      let newColumn = columnToFilter.filter(item => this.state.filterItems[item[0]] === true);
      filterIDs = newColumn.map(item => item[1]);
    }

    let newState = this.state;

    let oldRows;
    if (this.state.filteredRows.length !== 0) {
      oldRows = this.state.filteredRows
    } else {
      oldRows = newState.rows.slice(0);
    }

    let newRows = oldRows.slice(0,1);

    for (let i = 1; i < oldRows.length; i++) {
      // CHANGE TO HASH FOR FASTER LOOKUP
      if (filterIDs.includes(oldRows[i][oldRows[i].length-1])) {
        newRows.push(oldRows[i]);
      }
    }

    newState["filteredRows"] = newRows;
    newState["filterDisplay"] = "none";

    this.setState(newState);

  }
  // filterItems in state might need to have more content, i.e. a row for each column already
  // so that as filters are removed the apply filter function can look at remaining filters and
  // keep those in place
    // might need to reference an array of which filters are in place, i.e. that thought I had
    // of having this.state.filterColumn be an array
    // applyFilter would push column into array, removeFilter would remove it


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

      let columnCount = rows[0].length;

      let headers = [];
      for (let j = 0; j < columnCount; j++) {
        headers.push(
          <span>{rows[0][j]}
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

      function createRow(i) {
        let row = [];
        for (let k = 0; k < columnCount; k++) {
          row.push(<span>{rows[i][k]}</span>);
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

  render() {
    console.log(this.props.rows);
    console.log(this.state);
    return (
      <div>
        <div>The Table</div>
        <button onClick={() => this.clearFilters()}>Clear Filters</button>
        <div>{this.createFilter()}</div>
        <ul>
          {this.createTestLines()}
        </ul>
      </div>
    );
  }

}

export default CSVTable;
