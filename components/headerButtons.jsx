import React from 'react';
import ReactDOM from 'react-dom';

import Filter from './filter';

class HeaderButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDisplay: this.props.filterDisplay
    };
    this.closeFilter = this.closeFilter.bind(this);
  }

  openFilter() {
    if (this.state.filterDisplay === "none") {
      this.setState({filterDisplay: "block"});
    } else {
      this.setState({filterDisplay: "none"});
    }
  }

  closeFilter() {
    this.setState({filterDisplay: "none"});
  }

  render() {
    console.log("Buttons filDis:" + this.state.filterDisplay);
    return (
      <div className="sort-buttons-container"  style={{'zIndex': '2'}}>
        <div
          className="sort-button"
          onClick={() => this.openFilter()}
          ><i className="fas fa-filter"></i></div>
        <div
          className="sort-button"
          onClick={() => this.props.sortColumn(this.props.columnNum, "sort")}
          ><i className="fas fa-sort-down"></i></div>
        <div
          className="sort-button"
          onClick={() => this.props.sortColumn(this.props.columnNum, "reverse")}
          ><i className="fas fa-sort-up"></i></div>
        <Filter
          columnNum={this.props.columnNum}
          column={this.props.column}
          columnFilterList={this.props.columnFilterList}
          columnFilterHash={this.props.columnFilterHash}
          closeFilter={this.closeFilter}
          newApply={this.props.newApply}
          newNewApply={this.props.newNewApply}
          filterDisplay={this.state.filterDisplay}
          filterColumn={this.props.filterColumn}
          columnsToFilter={this.props.columnsToFilter}
          filterItems={this.props.filterItems}
          filterList={this.props.filterList}
          currentlyAppliedFilters={this.props.currentlyAppliedFilters}
          filteredRows={this.props.filteredRows}
          rows={this.props.rows}
          />
      </div>
    );
  }
}

export default HeaderButtons;
