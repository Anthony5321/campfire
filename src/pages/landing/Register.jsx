import { useState } from 'react'
import Client from '../../services/api'

const Register = ({ toggleForm }) => {

    const RegisterUser = async (data) => {
        try {
            console.log(data)
            const res = await Client.post('/users/register', data)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const initialState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    const [formValues, setFormValues] = useState(initialState)

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setFormValues(initialState)
        console.log('hi');
        await RegisterUser(formValues)
        await checkUser(formValues)
    }

    const checkUser = async (data) => {
        try {
            const res = await Client.post('/users/login', data)
            toggleForm()
            return res.data
        } catch (error) {
            console.log(error);
            throw error
        }
    }


    return (
        <form className="col" onSubmit={onSubmit}>
            <div className='header'>
                <h1>Create Account</h1>
            </div>
            <div className="input-wrapper-create">
                <label htmlFor="username"></label>
                <input
                    onChange={handleChange}
                    name="username"
                    type="text"
                    placeholder="Create Username"
                    defaultValue={formValues.username}
                    required
                />
            </div>
            <div className="input-wrapper-create">
                <label htmlFor="password"></label>
                <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    defaultValue={formValues.email}
                    placeholder="Enter Email"
                    required
                />
            </div>
            <div className="input-wrapper-create">
                <label htmlFor="password"></label>
                <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    defaultValue={formValues.password}
                    placeholder="Create password"
                    required
                />
            </div>
            <div className="input-wrapper-create">
                <label htmlFor="password"></label>
                <input
                    onChange={handleChange}
                    type="password"
                    name="confirmPassword"
                    defaultValue={formValues.confirmPassword}
                    placeholder="Confirm password"
                    required
                />
            </div>
            <button onClick={() => checkUser()}
                disabled={
                    !formValues.email ||
                    (!formValues.password &&
                        formValues.confirmPassword === formValues.password)
                }>
                Register
            </button>
            <div className='createFormText'>
                <p className='pCreate'>Already a user? <a onClick={() => toggleForm()}>Sign in</a></p>
            </div>
        </form>
    )
}
export default Register