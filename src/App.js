import * as React from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import "./App.css";

//import your icons
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NoMatch from './components/NoMatch';
import LoginPage from './components/LoginPage';
import FlightDataPage from './components/FlightDataPage';
import UserPage from './components/UserPage';

function App() {
  return (
    <BrowserRouter>
    {/* <React.Suspense fallback={<div style={{display:'flex', minHeight:'100vh', justifyContent:'center', alignItems: 'center'}}><Spinner animation="border" /></div>}> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/flightlog" element={<FlightDataPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      {/* </React.Suspense> */}
    </BrowserRouter>
  );
}

export default App;

library.add(fas, far);