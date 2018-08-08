import React from 'react';
import ReactDOM from 'react-dom';

// Components
import CSVTable from './components/table.jsx';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1>CSV App!</h1>
        <CSVTable />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
