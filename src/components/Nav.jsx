import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Nav.css';

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <nav className='navbar'>
      <h3 className='navbar-title'>Campfire</h3>
      <div className='navbar-burger' onClick={toggleMenu}>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
      </div>
      <div className={`navbar-links ${showMenu ? 'show' : ''}`}>
        <Link className='navbar-link' to={"/home"}>Home</Link>
        <Link className='navbar-link' to={"/add/story"}>Create A Story</Link>
        <Link className='navbar-link' to={"/your-stories"}>Your Stories</Link>
        <Link className='navbar-link' to={"/about"}>About</Link>
      </div>
    </nav>
  )
}

export default Nav;