import { createRoot } from 'react-dom/client';
import React from 'react';
import { App } from './App.tsx';
import './index.scss';

const element = document.querySelector('#root') as HTMLElement;
const root = createRoot(element);

root.render(
  <App />
);
