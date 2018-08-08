import React from 'react';
import ReactDOM from 'react-dom';
import CSVReader from "react-csv-reader";

class CSVTable extends React.Component {

  render() {

    function handleForce(data) {
      console.log(data);
    };

    return (
      <div>
        <h1>CSV Table</h1>
        <CSVReader
          cssClass="react-csv-input"
          label="Choose a CSV file to upload"
          onFileLoaded={handleForce}
        />
      </div>
    );
  }

}

export default CSVTable;
