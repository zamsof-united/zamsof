import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/zamsof.jpg';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarDark, setNavbarDark] = useState(false);

  const location = useLocation(); // React Router hook

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close the menu on route change
  useEffect(() => {
    setMenuOpen(false); // Reset menuOpen to false on every route change
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 570) {
        setNavbarDark(true);
      } else {
        setNavbarDark(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`nav-container ${navbarDark ? 'dark' : ''}`}>
      {/* Logo */}
      <div className="logo">
        <NavLink to="/">
          <img src={logo} alt="Logo" />
        </NavLink>
      </div>

      {/* Hamburger Menu Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <NavLink to="/" exact activeClassName="active">
              Home <span className="uleffect"></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active">
              About Us <span className="uleffect"></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/news" activeClassName="active">
              News <span className="uleffect"></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" activeClassName="active">
              Contact <span className="uleffect"></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/gallery" activeClassName="active">
              Gallery <span className="uleffect"></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/thematic" activeClassName="active">
              Thematic <span className="uleffect"></span>
            </NavLink>
          </li>

           {/* NEW: Jobs & News */}
          <li>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
              Jobs & News <span className="uleffect"></span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </header>
  );
}

export default Navbar;
