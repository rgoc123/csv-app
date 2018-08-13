import React from 'react';
import ReactDOM from 'react-dom';

// Components
import CSVTableParent from './components/tableParent.jsx';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1>CSV Table Generator</h1>
        <CSVTableParent />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
