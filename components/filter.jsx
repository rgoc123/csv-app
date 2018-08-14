import React from 'react';
import ReactDOM from 'react-dom';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDisplay: this.props.filterDisplay,
      filterColumn: null,
      columnsToFilter: [],
      filterItems: {},
      filterList: [],
      currentlyAppliedFilters: {},
      filteredRows: []
    }
  }

  render() {
    return (
      <div style={{"display": this.props.filterDisplay}}>
        <h4>This works</h4>
      </div>
    );
  }
}

export default Filter;
