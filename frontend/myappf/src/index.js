import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Provider } from 'react-redux';
import './index.css';
import FarmApp from './FarmApp';
import manistore from "./mainStore";
import { CookiesProvider } from 'react-cookie';


const root = ReactDOM.createRoot(document.getElementById('root'));

function HTMLPage() {
  return (
    <iframe
      src="http://localhost:8877/dataget/jbuchamber.html" // public/sample.html로 경로 지정
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="Sample HTML Page"
    ></iframe>
  );
}

root.render(
  <Provider store = {manistore}>
    <CookiesProvider> 
     <BrowserRouter>
     <Routes>
        <Route path="/datagetjbuniv" element={<HTMLPage />} />
        <Route path="/" element={<FarmApp />} />
      </Routes>

    
    </BrowserRouter>
    </CookiesProvider> 
  </Provider>
);


