import { createRoot } from 'react-dom/client';

const element = document.querySelector('#root');
const root = createRoot(element);

root.render(
  <h1>New text</h1>
);
