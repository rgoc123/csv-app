let newState = Object.assign({}, this.state);
let columnCount = this.state.rows[0].length;
for (let j = 0; j < columnCount; j++) {
  newState[j] = [];
}
console.log(newState);

// put each element in columns before creating line
// then put each set of column1[i], column2[i] into rows?


for (let k = 1; k < this.state.rows.length; k++) {
  for (let l = 0; l < columnCount; l++) {
    let parsedInt = parseInt(this.state.rows[k][l]);
    let cellVal;

    if (isNaN(parsedInt) === false) {
      newState.rows[k][l] = parseInt(this.state.rows[k][l]);
    } else {
      newState.rows[k][l] = this.state.rows[k][l]
    }

    newState[l].push([newState.rows[k][l], newState.rows[k][columnCount]]);
  }
}

console.log(newState);

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
this.setState(newState);
