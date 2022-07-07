import React from "react";
import { Link } from "react-router-dom";
import './Header.css'

const Header = (props) => {

    const miniCartElement = document.querySelector('.mini_cart')

    function showMiniCart(e){
        
        miniCartElement.classList.add('open')
    }

    function removeMiniCart(e){
        miniCartElement.classList.remove('open')
    }

    function miniCart(){

        return(
            props.cart.map(item => {
                return(
                    <aside className="mini_cart_container">
                        <div>
                        <img className="minicart_item_img" src={item.images.smallIcon} alt={item.id}></img>
                        </div>

                        <div className="minicart_item_details">
                            <div className="minicart_item_title">{item.name}</div>
                            <div>${item.price}</div>
                            <div><span className={item.rarity.displayValue}>{item.rarity.displayValue}</span></div>
                            <div>{item.type.value}</div>
                        </div>
                    </aside>
                )
            })
        )


    }

    return(

        <header className="header">

            <Link to='/' className="title">Fortnite Cosmetics</Link>

            <nav>
                <ul>
                    <Link to='/products'>Products</Link>
                    <li>About</li>
                    <Link to='/cart' className="cart">
                        <div style={{position: 'relative'}} onMouseOver={e => showMiniCart(e)} onMouseLeave={e => removeMiniCart(e)}>
                                <div className="mini_cart">
                                    {miniCart()}
                                </div>
                            <img className="cart_icon" src="./svg/cart.svg" alt="cart"></img>
                            <div className="qty_icon">{props.cart.length}</div>
                        </div>
                    </Link>
                    
                </ul>
            </nav>

        </header>
    )
}

export default Header;