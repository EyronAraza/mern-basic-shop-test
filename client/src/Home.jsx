import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ItemCard from './components/ItemCard'
import GlobalContext from './components/GlobalContext';
import { useContext } from 'react';

function Home() {
    const globalVars = useContext(GlobalContext)

    const navigate = useNavigate()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true

    // Create useCookies()
    const [username, setUsername] = useState("")

    // To check if user is actually login
    // This prevents non users to go to home page if not logged in
    useEffect(() => {
        // GET request
        axios.get(`${globalVars.originUrl}/home`)
            .then(result => {
                console.log(result)
                // If no user is logged in, send them back to login
                if (result.data !== "Success (Token checked!)") {
                    navigate('/login')
                } else {
                    // Get username after login
                    setUsername(Cookies.get('username'))
                }
            })
    }, [])

    const handleLogout = () => {
        // Remove the token and user from local storage
        Cookies.remove('token')
        Cookies.remove('username')

        // redirect to login page
        navigate('/login')
    };

    function handleNavigate(path) {
        navigate(path)
    }

    return (
        <div>
            <h2>WELCOME, {username}!</h2>
            <button onClick={handleLogout}>Logout</button>

            <button onClick={() => handleNavigate('/cart')}>Check Cart</button>

            <ItemCard itemName="Banana" price={5} />
            <ItemCard itemName="Cool Toy" price={30} />
            <ItemCard itemName="Apple" price={15} />
            <ItemCard itemName="Chicken" price={50} />
            <ItemCard itemName="Roblox Figure" price={100} />
        </div>
    )
}

export default Home;