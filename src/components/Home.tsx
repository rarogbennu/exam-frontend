// src/components/Home.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h2>Vælg venligst</h2>
      <nav>
        <ul>
          <li>
            <Link to="/participants">Deltagere</Link>
          </li>
          <li>
            <Link to="/disciplines">Discipliner</Link>
          </li>
          <li>
            <Link to="/results">Resultater</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;