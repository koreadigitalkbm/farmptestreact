import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import './index.css';
import FarmApp from './FarmApp';
import manistore from "./mainStore";
import { CookiesProvider } from 'react-cookie';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store = {manistore}>
    <CookiesProvider> 
     <BrowserRouter>
    <FarmApp />
    </BrowserRouter>
    </CookiesProvider> 
  </Provider>
);


