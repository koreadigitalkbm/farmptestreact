import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './lang/i18n';
import './index.css';
// import App from './App';
import FarmApp from './FarmApp';
import manistore from "./mainStore";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store = {manistore}>
    <FarmApp />
  </Provider>
);


