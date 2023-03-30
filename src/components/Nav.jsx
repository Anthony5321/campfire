import { Link, useNavigate } from 'react-router-dom'
import{ useState } from "react";

const Nav = ({ user, setUser }) => {

  const navigate = useNavigate()

  const [state, setState] = useState(false)

 const handleClick = () => {
    setState(!state)
}

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
    navigate('/Login')
  }

  return (
    <nav className='links'>
        <h3 className='link-title'>Campfire</h3>
      <div id="mobile" onClick={handleClick}>
        <i id="bar"
        className={state ? 'fas fa-times' : 'fas fa-bars'}></i>
        <Link to={"/home"} className="backLink"><p>Home</p></Link>
        <Link to={"/add/story"}><p>Create A Story</p></Link>
        <Link to={"/edit"}><p>Edit Your Story</p></Link>
    </div>
    </nav>
  )
}


export default Nav