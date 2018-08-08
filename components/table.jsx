import React from 'react';
import ReactDOM from 'react-dom';
import CSVReader from "react-csv-reader";

class CSVTable extends React.Component {

  constructor() {
    super();
    this.state = {
      rows: []
    };
    this.handleForce = this.handleForce.bind(this);
  }

  createTestLines() {
    if (this.state.rows.length === 0) {
      return null;
    } else {
      let i = 0;
      return this.state.rows.map(row => {
        i += 1;
        return (<li key={i}>{row}</li>);
      });
    }
  }

  handleForce(data) {
    this.setState({
      rows: data
    });
  };

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
          {this.createTestLines()}
        </div>
      </div>
    );
  }

}

export default CSVTable;
