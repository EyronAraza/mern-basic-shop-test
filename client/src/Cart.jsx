import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ItemCard from './components/ItemCard'
import GlobalContext from './components/GlobalContext';

function Cart() {
    const globalVars = useContext(GlobalContext)

    const navigate = useNavigate()

    // Allow credentials (to allow cookies or else you cant login!)
    axios.defaults.withCredentials = true

    // Store variables
    const [cartItems, setCartItems] = useState([]);
    const [username, setUsername] = useState("")

    // To check if user is actually login
    // This prevents non users to go to home page if not logged in
    useEffect(() => {
        // Function to check if user is logged in and fetch cart items
        const checkLoginAndFetchCartItems = async () => {
            // First, check if user is logged in
            const loginResult = await axios.get(`${globalVars.originUrl}/home`);
            console.log(loginResult.data);
            // If no user is logged in, send them back to login
            if (loginResult.data !== "Success (Token checked!)") {
                navigate('/login');
            } else {
                // Get username after login
                const username = Cookies.get('username');

                // Save username to useState varible
                setUsername(username)

                // Fetch added cart items using the username from cookies
                const cartResponse = await axios.get(`${globalVars.originUrl}/cart/items?username=${username}`);
                setCartItems(cartResponse.data);
            }
        };

        // Call function
        checkLoginAndFetchCartItems();
    }, [navigate]); //  Include navigate in dependency array if it's used inside the effec

    // useEffect(() => {
    //     // Check if user has any added cart items
    //     axios.get(`http://localhost:5000/cart/items?username=${Cookies.get('username')}`)
    //         .then(response => {
    //             setCartItems(response.data);
    //             // console.log(response.data)
    //         })
    //         .catch(error => console.error("Error fetching cart items:", error));
    // }, []);

    function handleNavigate(path) {
        navigate(path)
    }

    return (
        <div>
            <h1>{username}'s Cart</h1>
            <button onClick={() => handleNavigate('/home')}>Back</button>
            {cartItems.map(item => (
                <ItemCard key={item._id} itemName={item.item} price={item.price} />
            ))}
        </div>
    )
}

export default Cart