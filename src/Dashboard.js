import React, {useContext} from "react";
import { mainContext } from "./RouteSwitch";


const Dashboard = () => {

    const {authUser} = useContext(mainContext)

    return(

        <div>
            <h1>{authUser.credits}</h1>


            {authUser.orders.map(collection => {
                

                return (
                <div>
                    <h2>{collection.orderNum}</h2>

                    {collection.items.map(item => {
                        return(
                            <div>
                                <span>{item.images.smallIcon}</span>
                                <h3>{item.name}</h3>
                                <span>{item.rarity.value}</span>
                                <span>{item.price}</span>
                                <span>{item.qty}</span>
                            </div>
                        )
                    })}

                </div>
   



                )

            })}
                
        </div>
       
    )
}

export default Dashboard