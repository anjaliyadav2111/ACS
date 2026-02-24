import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomeExperience from './pages/HomeExperience';
import Navbar from './components/layout/Navbar';
import FloatingContactMenu from './components/ui/FloatingContactMenu';


function App() {
  const [isHomeLandingComplete, setIsHomeLandingComplete] = useState(false);
  const location = useLocation();
  const shouldShowNavbar = location.pathname === '/' ? isHomeLandingComplete : true;

  return (
    <>
      <Navbar isVisible={shouldShowNavbar} />
      <Routes>
        <Route
          path="/"
          element={<HomeExperience onLandingComplete={() => setIsHomeLandingComplete(true)} />}
        />
      </Routes>
      <FloatingContactMenu isVisible={shouldShowNavbar} />
    </>
  );
}

export default App;
