import React from "react";
import { Link } from "react-router-dom";
import './Header.css'

const Header = (props) => {

    return(

        <div className="header">

            <Link to='/' className="title">Fortnite Cosmetics</Link>

            <nav>
                <ul>
                    <Link to='/products'>Products</Link>
                    <li>About</li>
                    <Link to='/cart' className="cart">
                        <img className="cart_icon" src="./svg/cart.svg" alt="cart"></img>
                        <div className="qty_icon">{props.qty}</div>
                    </Link>
                    
                </ul>
            </nav>

        </div>
    )
}

export default Header;