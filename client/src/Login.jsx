import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlobalContext from './components/GlobalContext';

function Login() {
    // Access Global variables
    const globalVars = useContext(GlobalContext)

    // Store user details
    // const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true;

    // Send user details to server side ("server" folder)
    // This post the data to the server's localhost (NOT client's localhost)
    const handleSubmit = (e) => {
        e.preventDefault() // prevent browser from reloading the page so the code below can be executed
        axios.post(`${globalVars.originUrl}/login`, { email, password }) // This post the data to the server's localhost
            .then(result => {
                console.log(result)
                // Check if login is success
                if (result.data === "Success") {
                    navigate('/home') // go to home page after login
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-50">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="text"
                            placeholder='Enter Email'
                            autoComplete='off'
                            name='email'
                            className='form-control rounded-0'
                            onChange={(e) => setEmail(e.target.value)} // Store to variable
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            name='password'
                            className='form-control rounded-0'
                            onChange={(e) => setPassword(e.target.value)} // Store to variable
                        />
                    </div>

                    <button type='submit' className='btn btn-success w-100 rounded-0'>
                        Login
                    </button>
                </form>

                <p>Don't have account?</p>
                {/* Sign up button that links to register page*/}
                <Link to="/register" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default Login;