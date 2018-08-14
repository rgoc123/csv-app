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

  createFilterDiv() {
    function createCheckbox(item) {
      return (
        <div
          className="checkbox-container"
          key={item}>
          <input id={item}
            className="checkbox"
            type="checkbox"
            value={item}
            onChange={this.changeFilterItemValue}
          />
          <label>{item}</label>
        </div>
      );
    }
    createCheckbox = createCheckbox.bind(this);

    let checkboxes = this.props.columnFilterList.map(item => createCheckbox(item));
    return (
      <div className="filter-div">
        {checkboxes}
      </div>
    );
  }

  render() {
    return (
      <div style={{"display": this.props.filterDisplay}}>
        <h4>This works</h4>
        <button onClick={() => this.props.newApply()}>New Appy</button>
        {this.createFilterDiv()}
      </div>
    );
  }
}

export default Filter;
