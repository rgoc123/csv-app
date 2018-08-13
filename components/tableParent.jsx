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

  render() {
    return (
      <div className="table-parent">
        <CSVReader
          cssClass="react-csv-input"
          label="Choose a CSV file to upload"
          onFileLoaded={this.handleForce}
        />
        <div className="table-div-container">
          <CSVTable rows={this.state.rows}/>
        </div>
      </div>
    );
  }

}

export default CSVTableParent;
