import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import ConnectedHome from './components/Home.js';
import { CombinedReducers } from './reducers/combined_reducers.js';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const store = createStore(
  CombinedReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//store.dispatch(Login(person0));

ReactDOM.render(

  <React.StrictMode>
    <Provider store={store}>
      <ConnectedHome />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
