import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1>CSV App!</h1>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
