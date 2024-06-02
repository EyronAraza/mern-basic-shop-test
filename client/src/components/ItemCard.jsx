import { useEffect, useState, useContext } from "react"
import Cookies from 'js-cookie';
import axios from 'axios';
import GlobalContext from './GlobalContext';

function ItemCard({ itemName, price }) {
    const globalVars = useContext(GlobalContext)

    const [isAdded, setAdded] = useState(false)
    const username = Cookies.get('username')

    useEffect(() => {
        // Check if there are any added items by the user in the database
        axios.get(`${globalVars.originUrl}/cart/status?username=${username}&item=${encodeURIComponent(itemName)}`)
            .then(response => {
                setAdded(response.data.isInCart);
            })
            .catch(error => console.error("Error fetching cart status:", error));
    }, []);

    // Function to toggle the cart item status
    const toggleCartItemStatus = () => {
        setAdded(prevState => !prevState);
    };

    // Handle cart button
    const handleCartBtn = (e) => {
        const newState = !isAdded;

        if (newState) { // Item is added to cart
            console.log(`[${username}] ${itemName} is added to cart!`)

            // Post item to database
            axios.post(`${globalVars.originUrl}/cart`, { name: username, item: itemName, price }) // This post the data to the server's localhost
                .then(result => {
                    console.log(result)
                })
                .catch(err => console.log(err))
        } else { // item is removed from cart
            console.log(`[${username}] ${itemName} is removed from your cart.`)

            // Delete specific item from database
            axios.delete(`${globalVars.originUrl}/cart/${username}/${itemName}`)
                .then(result => {
                    console.log(result.data);
                })
                .catch(err => console.log(err));
        }

        toggleCartItemStatus()
    };

    const boxStyle = {
        width: "200px",
        height: "auto",
        border: "2px solid black",
        padding: "5px",
        boxSizing: "border-box",
        margin: "20px 0"
    }

    const removeCartBtnStyle = {
        backgroundColor: "red",
        color: "white"
    }

    return (
        <div style={boxStyle}>
            <h2>{itemName}</h2>
            <hr></hr>
            <p>Price: {price} AED</p>
            <button
                onClick={(e) => handleCartBtn(e)}
                style={isAdded ? removeCartBtnStyle : {}}>
                {isAdded ? "Remove" : "Add To Cart"}
            </button>
        </div>
    )
}

export default ItemCard