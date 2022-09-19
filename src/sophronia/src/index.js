import React from 'react';
import { StrictMode, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Root } from "./Routes";
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Root />
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
