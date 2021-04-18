import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import ConnectedHome from './components/home/Home.js';
import { CombinedReducers } from './reducers/combined_reducers.js';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const compose_enhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    CombinedReducers,
    compose_enhancer(applyMiddleware(thunk))
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
