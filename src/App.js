import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


const App = () => {

    const [inventory, setInventory] = useState([])



    return(

        <div>

            <h1>Grocery Delivery</h1>
            {/* <Link to={'/Products'}>Shopping</Link> */}
            <Link to={'/register'}>Register</Link>
            <Link to={'/login'}>Login</Link>

        </div>
    )




}

export default App;