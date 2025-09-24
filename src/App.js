import React from 'react';
import LoginScreen from './LoginScreen'; // Make sure the path is correct
import './App.css';
import EventDetail from "./components/EventDetail";

function App() {
  return (
    <div className="App">
     <LoginScreen />
     <EventDetail />
  </div>
  );
}

export default App;
