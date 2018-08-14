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
      filterHash: this.props.columnFilterHash,
      currentlyAppliedFilters: {},
      filteredRows: []
    }
    this.changeFilterItemValue = this.changeFilterItemValue.bind(this);
  }

  changeFilterItemValue(e) {
    let filterItem = e.target.value;
    let filterHash = this.state.filterHash;
    if (filterHash[filterItem] === true) {
      filterHash[filterItem] = false;
    } else {
      filterHash[filterItem] = true;
    }
    this.setState({
      filterHash: filterHash
    });
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
        <button onClick={() => this.props.newApply(this.props.columnNum, this.props.columnFilterList)}>New Appy</button>
        {checkboxes}
      </div>
    );
  }

  render() {
    console.log(this.state);
    return (
      <div style={{"display": this.props.filterDisplay}}>
        <h4>This works</h4>
        {this.createFilterDiv()}
      </div>
    );
  }
}

export default Filter;
