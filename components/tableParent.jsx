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
  }

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
