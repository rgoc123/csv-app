import React from 'react';
import ReactDOM from 'react-dom';
import CSVReader from 'react-csv-reader';

// Components
import CSVTable from './table';

class CSVTableParent extends React.Component {

  constructor() {
    super();
    this.state = {
      rows: [],
      newCol: []
    };
    this.handleForce = this.handleForce.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
  }

  // Possibly include column num as parameter
  sortColumn(columnNum) {
    // sort column
    // create hash
    // sort other columns

    let num = parseInt(columnNum);

    let colDataType = typeof this.state[num][0][0];
    let sortedColumn;

    let newState = Object.assign({}, this.state);

    if (colDataType === 'string') {
      sortedColumn = this.state[num].slice(0).sort();
      newState[num] = sortedColumn;
      this.setState(newState);
    } else {
      sortedColumn = this.state[num].slice(0).sort(function(a,b) {
        return a[0]-b[0];
      });
      newState[num] = sortedColumn;
      this.setState(newState);
    }
  }

  // setSortedColumn(num) {
  //   let sortedColumn = await this.sortColumn(num);
  //   this.setState({
  //     [num]: sortedColumn
  //   });
  // }

  reverseSortColumn(columnNum) {

  }
  // [[1, 4][2, 5][3, 6]]
  // have variables that store info for each column
  // sort a column

  handleForce(data) {
    this.setState({
      rows: data
    });
    let newRows = this.state.rows;
    for (let i = 1; i < newRows.length; i++) {
      newRows[i].push(i);
    }
    this.setState({
      rows: newRows
    });
  };

  // can create a hash with keys
  // we can sort a column, and its elements will have keys
  // we can then sort the other column by the key

  render() {
    return (
      <div>
        <h1>CSV Table</h1>
        <CSVReader
          cssClass="react-csv-input"
          label="Choose a CSV file to upload"
          onFileLoaded={this.handleForce}
        />
        <div>
          <CSVTable rows={this.state.rows}/>
        </div>
      </div>
    );
  }

}

export default CSVTableParent;
