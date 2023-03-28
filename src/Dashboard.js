import React, {useContext, useEffect} from "react";
import { mainContext } from "./RouteSwitch";
import { useNavigate, Link } from 'react-router-dom'
import './Dashboard.css'


const Dashboard = () => {

    const {authUser, setAuthUser} = useContext(mainContext)
    const redirect = useNavigate()

    useEffect(() => {
        document.title = 'My orders'
    }, [])

    const Orders = () => {

        return(
            authUser.orders.map(collection => {
                        
                return (
                    <div className="order_title">
                        <h2>Order Num: {collection.orderNum}</h2>

                        {collection.items.map(item => {
                            return(
                                <div className="order_container">
                                    <img className="order_item_icon" src={item.images.smallIcon} alt='item_icon_small'></img>
                                    <h3>{item.name}</h3>
                                    <h3>${item.price}</h3>
                                    <h3>Qty:{item.qty}</h3>
                                </div>
                            )
                        })}

                    </div>
                )
            })
        )
    }

    const Logout = () => {
        setAuthUser({})
        redirect('/login')
    }

    return(

        <div>

            <div className="dashboard_container">

            {authUser.orders.length === 0 ? 
            <h1>You have no past orders. Browse our <Link to='/products'>Products</Link></h1> :
            <>
            <button onClick={Logout} className='btn_logout'>Log out</button>
            <Orders />
            </>
            }
            </div>
                
        </div>
       
    )
}

export default Dashboard