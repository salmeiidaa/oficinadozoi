import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AgendamentoCliente from './components/AgendamentoCliente';
import DashboardDono from './components/DashboardDono';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<AgendamentoCliente />} />
          <Route path="/admin" element={<DashboardDono />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
