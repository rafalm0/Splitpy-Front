// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'; // Assuming your Header component is in the components folder
import About from './pages/About'; // Import the About page
import Home from './pages/Home'; // Your existing Home page component

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />  {/* Add route for About page */}
      </Routes>
    </Router>
  );
};

export default App;
