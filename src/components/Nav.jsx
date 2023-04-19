import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Nav.css';

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <nav className='navbar'>
      <NavLink className='navbar-title' activeClassName='active' exact to={"/home"}>
        Campfire
      </NavLink>
      <div className={`navbar-burger ${showMenu ? 'active' : ''} hide-lg`} onClick={toggleMenu}>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
        <div className={`navbar-burger-line ${showMenu ? 'active' : ''}`}></div>
      </div>
      <div className={`navbar-links ${showMenu ? 'show' : ''}`}>
        <NavLink className='navbar-link' activeClassName='active' exact to={"/home"}>Home</NavLink>
        <NavLink className='navbar-link' activeClassName='active' to={"/add/story"}>Create A Story</NavLink>
        <NavLink className='navbar-link' activeClassName='active' to={"/your-stories"}>Your Stories</NavLink>
        <NavLink className='navbar-link' activeClassName='active' to={"/about"}>About</NavLink>
      </div>
    </nav>
  )
}

export default Nav;