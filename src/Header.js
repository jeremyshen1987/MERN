import React, {useContext} from "react";
import { Link} from "react-router-dom";
import './Header.css'
import { mainContext } from "./RouteSwitch";

const Header = () => {

    const {authUser, setAuthUser, cart, setCart}  = useContext(mainContext)

    const miniCartElement = document.querySelector('.mini_cart')
    function showMiniCart(e){
        
        miniCartElement.classList.add('open')
    }

    function removeMiniCart(e){
        miniCartElement.classList.remove('open')
    }

    function miniCart(){

        return(
            cart.map(item => {
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

    const Profile = () => {
        if(authUser.username){
            return(
                <a className="profile_container" href="/">
                    <li to='/' className="profile_pic"><img  src='/svg/profile.svg' style={{width: '45px'}} alt="profile"></img></li>
                    <div className="profile_title">Hello,</div>
                    <div className="profile_subtitle">{authUser.username}</div>
                </a>
            )
        }
        else{
            return(
                <a className="profile_container" href="/login">
                    <li to='/' className="profile_pic"><img  src='/svg/profile.svg' style={{width: '45px'}} alt="profile"></img></li>
                    <div className="profile_title">Hello,</div>
                    <div className="profile_subtitle">Guest</div>
                </a>
            )
        }
    }

    return(

        <header className="header_container">

            <Link to='/' className="title">Fortnite Cosmetics</Link>

            <nav>
                <ul>
                    <Link to='/products'>Products</Link>

                    < Profile />

                    <Link to='/cart' className="cart">
                        <div style={{position: 'relative'}} onMouseOver={e => showMiniCart(e)} onMouseLeave={e => removeMiniCart(e)}>
                                <div className="mini_cart">
                                    {miniCart()}
                                </div>
                            <img className="cart_icon" src="./svg/cart.svg" alt="cart"></img>
                            <div className="qty_icon">{cart.length}</div>
                        </div>
                    </Link>
                    
                </ul>
            </nav>

        </header>
    )
}

export default Header;