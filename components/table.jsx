import React from 'react';
import ReactDOM from 'react-dom';
import CSVReader from 'react-csv-reader';

class CSVTable extends React.Component {

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
    function sortTheColumn(num) {
      let colDataType = typeof this.state[num][0][0];
      let sortedColumn;

      if (colDataType === 'string') {
        sortedColumn = this.state[num].slice(0).sort();
      } else {
        sortedColumn = this.state[num].slice(0).sort(function(a,b) {
          return a[0]-b[0];
        });
      }
      return sortedColumn;
    }

    sortTheColumn = sortTheColumn.bind(this);

    async function setSortedColumn(num) {
      let sortedColumn = await sortTheColumn(num);
      let newState = await this.state;
      newState[num] = await sortedColumn;
      this.state[num] = sortedColumn;
      await this.setState(newState);
    }

    setSortedColumn = setSortedColumn.bind(this);
    setSortedColumn(num);


    // // this.setState({
    // //   'test': sortedColumn
    // // });
    // this.state[num] = sortedColumn;

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

  createTestLines() {
    // GOING TO NEED SOMETHING TO KNOW HOW MANY SPANS
    // TO CREATE FOR EACH COLUMN
    // LIKE HAVE A COLUMNSCOUNT VARIABLE THAT COUNTS THE
    // LENGTH OF ANY ROW, AND THEN HAVE A FUNCTION THAT
    // GENERATES SPAN FOR EACH COUNT, WITH AN I COUNTER
    // FILL IN THE ROW[I], i.e. the array's elements/cell
    // info
    if (this.state.rows.length === 0) {
      return null;
    } else {
      let columnCount = this.state.rows[0].length;
      for (let j = 0; j < columnCount; j++) {
        this.state[j] = [];
      }

      // put each element in columns before creating line
      // then put each set of column1[i], column2[i] into rows?

      for (let k = 1; k < this.state.rows.length; k++) {
        for (let l = 0; l < columnCount; l++) {
          let parsedInt = parseInt(this.state.rows[k][l]);
          let cellVal;

          if (isNaN(parsedInt) === false) {
            this.state.rows[k][l] = parseInt(this.state.rows[k][l]);
          } else {
            this.state.rows[k][l] = this.state.rows[k][l]
          }

          this.state[l].push([this.state.rows[k][l], this.state.rows[k][columnCount]]);
        }
      }

      // Is there some kind of way to keep a tracker (like a key)
      // on a line so that when a sort on one column is run it
      // can find the other cells with the same key and put them
      // in the same index in this.state.rows

      // If I sort names, it's going to sort them alphabetically
      // Can I than find cells in other columns with same key, and
      // then put them in the new index of the sorted cell?
      // Will possibly need a hash for fast lookups
        // I.e. The hash keeps track of key and new index, so
        // look at other columns key, hash[key] will have the new index
        // then put the cell at that index

      // Need to figure out how to give each cell a key
      // or maybe columns should be hashes (but probably not)
      // because if columns have multiple values it will get
      // confused
        // Could add key to row, then have a hash with the key is
        // the hash key and the hash value is the original row
        // The hash could keep track of the key's index (i.e. row number). When a column is sorted, it updates the hash with the new index, then the other columns reference the hash with the new index


      // Have new rows
      let i = -1;
      return this.state.rows.map(row => {
        i += 1;
        if (i === 0) {
          return (
            <li key={i}>
              <span>{row[0]}<div
                className="sort-button"
                onClick={() => this.sortColumn(0)}
                >Sort</div></span>
              <span>{row[1]}<div
                className="sort-button"
                onClick={() => this.sortColumn(1)}
                >Sort</div></span>
            </li>);
        } else {
          return (
            <li key={i}>
              <span>{row[0]}</span>
              <span>{row[1]}</span>
            </li>);
        }
      });
    }
  }

  handleForce(data) {
    console.log("I'm reseting rows");
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
    console.log(this.state);
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
