// state filterItems will need to be an object of objects (the columns and
// whether they're items are filtered or not (this will maintain which filters
// applied))

// for each column in filter, filter down ids, then produce rows
applyFilter2() {
  let columnsToFilter = this.state.columnsToFilter.slice(0);

  let filterIDs;
  for (let i = 0; i < columnsToFilter.length; i++) {
    let columnToFilter = this.state[i].slice(0);
    let oldColumn = columnToFilter;
    let newColumn = columnToFilter.filter(item => this.state.filterItems[item[0]] === true);

    filterIDs = newColumn.map(item => item[1]);
  }
}


applyFilter() {
  let columnToFilterNum = this.state.filterColumn;
  let columnToFilter = this.state[columnToFilterNum].slice(0);
  let oldColumn = columnToFilter;
  let newColumn = columnToFilter.filter(item => this.state.filterItems[item[0]] === true);
  console.log(newColumn);

  let filterIDs = newColumn.map(item => item[1]);
  console.log(filterIDs);
  // above could be something in state to track filtered IDs
  let columnCount = this.props.rows[0].length;

  let newState = this.state;
  // newState[columnToFilterNum] = newColumn;

  // change rows to only have rows that have id of element in new col
  // change new state rows[]
  let oldRows = newState.rows.slice(0);
  let newRows = oldRows.slice(0,1);
  for (let i = 1; i < oldRows.length; i++) {
    // CHANGE TO HASH FOR FASTER LOOKUP
    if (filterIDs.includes(oldRows[i][oldRows[i].length-1])) {
      newRows.push(oldRows[i]);
    }
  }
  // Create state filtered columns here
  // Add if else statement for creating column to filter based on
  // whether state filtered column exists

  // if (!this.state.filteredRows)
    // for each old column
      // have new column empty
      // filter rows from old column into new column that have id
      // create newState[newColumn] = newColumn
  // else
    // for each filtered column
      // have new column empty
      // filter rows
      // set newState [newColumn] = newColumn

  newState["filteredRows"] = newRows;
  newState["filterDisplay"] = "none";

  this.setState(newState);

}
