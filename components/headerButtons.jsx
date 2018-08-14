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
    if (this.state.filterDisplay === "none") {
      this.setState({filterDisplay: "block"});
    } else {
      this.setState({filterDisplay: "none"});
    }
  }

  render() {
    return (
      <div className="header-buttons-div">
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
        <Filter filterDisplay={this.state.filterDisplay} />
      </div>
    );
  }
}

export default HeaderButtons;
