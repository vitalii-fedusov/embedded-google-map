import logo from './logo.svg';
import './App.css';
import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
          Create develop branch
        </a>
        <h1>Test commit</h1>
      </header>
    </div>
  );
}
