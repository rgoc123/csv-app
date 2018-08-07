import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1>The Shows!</h1>

        <Route exact path="/testform" component={TestForm} />
        <Route exact path="/shows" component={ShowsIndex} />
        <Route exact path="/createShow" component={ShowFormContainer} />
        <Route exact path="/shows/:id" component={ShowFormContainer} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
