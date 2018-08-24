import React from 'react';
import ReactDOM from 'react-dom';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      filterColumn: null,
      columnsToFilter: [],
      filterItems: {},
      filterList: [],
      columnFilterHash: this.props.columnFilterHash,
      currentlyAppliedFilters: {},
      filteredRows: [],
      itemsToFilterBy: []
    }
    this.changeFilterItemValue = this.changeFilterItemValue.bind(this);
    this.newChangeFilterItemValue = this.newChangeFilterItemValue.bind(this);
  }

  changeFilterItemValue(e) {
    let filterItem = e.target.value;
    let filterHash = this.state.columnFilterHash;
    if (filterHash[filterItem] === true) {
      filterHash[filterItem] = false;
    } else {
      filterHash[filterItem] = true;
    }
    this.setState({
      columnFilterHash: filterHash
    });
  }

  newChangeFilterItemValue(e) {
    let filterItem = e.target.value;
    let filterHash = this.state.columnFilterHash;
    let itemsToFilterBy = this.state.itemsToFilterBy;
    // Deselecting a filter option
    if (filterHash[filterItem] === true) {
      filterHash[filterItem] = false;
      let itemIndex = itemsToFilterBy.indexOf(filterItem);
      itemsToFilterBy.splice(itemIndex, 1);
    } else {
      // Selecting a filter option
      filterHash[filterItem] = true;
      itemsToFilterBy.push(filterItem);
    }
    this.setState({
      columnFilterHash: filterHash,
      itemsToFilterBy: itemsToFilterBy
    });
  }

  executeApply() {
    this.props.closeFilter();
    this.props.newNewApply(this.props.columnNum, this.state.columnFilterHash, this.state.itemsToFilterBy)
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
            onChange={this.newChangeFilterItemValue}
          />
          <label>{item}</label>
        </div>
      );
    }
    createCheckbox = createCheckbox.bind(this);

    let checkboxes = this.props.columnFilterList.map(item => createCheckbox(item));
    return (
      <div className="filter-div">
        <button onClick={() => this.executeApply()}>New Appy</button>
        {checkboxes}
      </div>
    );
  }

  render() {
    console.log("Filter filDis:" + this.props.filterDisplay);
    return (
      <div style={{"display": this.props.filterDisplay}}>
        {this.createFilterDiv()}
      </div>
    );
  }
}

export default Filter;
