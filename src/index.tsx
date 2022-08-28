import React from 'react';
import './style/base.scss';
import App from './App';
import {HashRouter} from 'react-router-dom';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './store/store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </HashRouter>
    </React.StrictMode>
);
