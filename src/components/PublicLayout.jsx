import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main>

        <Outlet /> 
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default PublicLayout;