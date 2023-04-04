import { useState } from 'react'
import './Landing.css'
import LoginForm from './LoginForm'
import Register from './Register'


const Login = ({ setUser }) => {

  const [form, setForm] = useState(false)

  const toggleForm = () => {
    setForm(!form)
  }

  return (
    <div className="form-page-ctn">
      <div className="form-ctn">
        {form ? <Register toggleForm={toggleForm} /> : <LoginForm toggleForm={toggleForm} setUser={setUser} />}
      </div>
    </div>
  )


}

export default Login