import React from 'react';
import ReactDOM from 'react-dom';

import Filter from './filter';

class HeaderButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDisplay: "none"
    };
  }

  openFilter() {
    let newState = this.state;
    
    if (this.state.filterDisplay === "none") {
      this.setState({filterDisplay: "block"});
    } else {
      this.setState({filterDisplay: "none"});
    }
  }

  render() {
    return (
      <div style={{'zIndex': '2'}}>
        <div
          className="sort-button"
          onClick={() => this.openFilter()}
          ><i className="fas fa-filter"></i></div>
        <div
          className="sort-button"
          onClick={() => this.sortColumn(j, "sort")}
          ><i className="fas fa-sort-down"></i></div>
        <div
          className="sort-button"
          onClick={() => this.sortColumn(j, "reverse")}
          ><i className="fas fa-sort-up"></i></div>
        <Filter
          columnNum={this.props.columnNum}
          column={this.props.column}
          columnFilterList={this.props.columnFilterList}
          columnFilterHash={this.props.columnFilterHash}
          newApply={this.props.newApply}
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
