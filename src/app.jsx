import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import CopyPasta from './copyPasta.jsx';

function render() {
    const root = createRoot(document.getElementById('app-content'));
    root.render(<CopyPasta></CopyPasta>);
}

render();