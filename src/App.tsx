import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ParticipantList from '../src/components/ParticipantList';
import Disciplines from '../src/components/Disciplines';
import Home from '../src/components/Home';
import ResultsManagement from '../src/components/ResultManagment';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/disciplines" element={<Disciplines />} />
        <Route path="/participants" element={<ParticipantList />} />
        <Route path="/results" element={<ResultsManagement />} />
      </Routes>
    </Router>
  );
};

export default App;