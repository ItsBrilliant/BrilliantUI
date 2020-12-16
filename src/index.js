import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Main } from './components/Main.js';
import { Home } from './components/Home.js';

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);
