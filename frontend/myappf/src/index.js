import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import './lang/i18n';
import './index.css';
import FarmApp from './FarmApp';
import manistore from "./mainStore";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store = {manistore}>
     <BrowserRouter>
    <FarmApp />
    </BrowserRouter>
  </Provider>
);


