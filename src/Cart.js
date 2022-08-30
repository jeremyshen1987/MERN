import React, {useState, useEffect, useContext} from "react";
import { mainContext } from "./RouteSwitch";
import './Cart.css'

const Cart = () => {

    const {cart, setCart, authUser, setAuthUser} = useContext(mainContext)

    const cartQty = cart.length
    const [priceTotal, setPriceTotal] = useState(0)

    useEffect(() => {
    
        if(cartQty === 0){
            setPriceTotal(preVal => preVal = 0)
            return
        }

        const total = cart.reduce((total, nextVal) => {

            return total + nextVal.price * nextVal.qty
        }, 0)

        setPriceTotal(total)
  
    }, [cart])


    function addQty(item){

        setCart( preArr => {

            const newArr = preArr.map(obj => {
                if(obj.id === item.id){
                    return {...obj, qty : obj.qty + 1}
                }
                return obj
            })

        return newArr
        })

    }

    function subQty(item){

        if(item.qty === 1){

            setCart( preArr => {
                const newArr = preArr.filter(obj => obj.id !== item.id)
                return newArr
            })

            return
        }

        setCart( preArr => {

            const newArr = preArr.map(obj => {
                if(obj.id === item.id){
                    return {...obj, qty : obj.qty - 1}
                }
                return obj
            })

        return newArr
        })
    }

    const CheckoutBtn = () => {

        if(authUser.username) {
            return(
                <button className="checkout_btn" onClick={() => pay(cart)}>PAY</button>
            )
        }
        else{
            return(
                <button disabled className="checkout_btn" onClick={() => pay()}>PAY</button>
            )
        }

    }

    async function pay(cart){

        console.log('cart:', cart)
        if(authUser.credits < priceTotal){
            alert('insufficient funds')
            return
        }

        const data = {
            
            cart: cart,
            uid: authUser.uid,
            orderNum: (authUser.orders.length + 1),
            priceTotal: priceTotal
        }
        
        const cart_POST = await fetch('http://localhost:5000/checkout', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const response = await cart_POST.json()


        // setAuthUser(preVal =>({
        //     ...preVal,
        //     credits: (preVal.credits - priceTotal)
        // }))

        console.log(response)
        console.log('cart items sent')

    }

    return(

        <div>
            
            <div className="cart_title">Shopping Cart</div>

            <div className="cart_header">
                <div></div>
                <div>Item details</div>
                <div>Unit Price</div>
                <div>&nbsp; &nbsp; &nbsp;Qty</div>
            </div>


            {cart.map(item => {
                return(
                <div className="single_item_container" key={item.id}>

                    <div>
                    <img className="item" src={item.images.smallIcon} alt={item.id}></img>
                    </div>

                    <div className="cart_item_details">
                        <h3>{item.name}</h3>
                        <div><span className={item.rarity.displayValue}>{item.rarity.displayValue}</span></div>
                        <div>{item.type.value}</div>
                    </div>

                    <div>
                        <div className="price">${item.price}</div>
                    </div>

                    <div>
                        <div className="qty_container">
                            <button onClick={() => subQty(item)}><img className="change_qty" src="./svg/minus.svg" alt="cart"></img></button>
                            <span>  {item.qty}  </span>
                            <button onClick={() => addQty(item)}><img className="change_qty" src="./svg/plus.svg" alt="cart"></img></button>
                        </div>
                    </div>
                </div>
                )
            })}

            <div className="empty_cart">{cartQty === 0 ? 'No item in cart' : ''}</div>

            <div className="checkout_total">
                {cartQty === 0 ? '' : `Total Price: ${priceTotal}`}
            </div>

            <div className="checkout">
                {cartQty === 0 ? '' : <CheckoutBtn />} 
            </div>

        </div>
    )



}

export default Cart;