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
      newCol: [],
      loading: ''
    };
    this.handleForce = this.handleForce.bind(this);
    this.createTable2 = this.createTable2.bind(this);
  }

  handleForce(data) {
    let newRows = data;
    for (let i = 1; i < newRows.length; i++) {
      newRows[i].push(i);
    }
    this.setState({
      rows: newRows,
      loading: 'loading'
    });
  };

  createTable2() {
    if (this.state.rows.length === 0) {
      return null;
    } else if (this.state.loading === 'loading') {
      return (<div id="loading">Loading</div>);
    } else {
      return (
        <div>
          <div className="table-div-container">
            <CSVTable rows={this.state.rows}/>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="table-parent">
        <CSVReader
          cssClass="react-csv-input"
          label="Choose a CSV file to upload"
          onFileLoaded={this.handleForce}
        />
        {this.createTable2()}
      </div>
    );
  }

  componentDidUpdate() {
    if (this.state.loading === 'loading') {
      setTimeout(() => this.setState({loading: 'not-loading'}), 1000);
    }
  }

}

export default CSVTableParent;
