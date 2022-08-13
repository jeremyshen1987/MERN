import React, {useContext} from 'react'
import { cityContext } from './RouteSwitch'

export const Auth = () => {
    const {test1, test2} = useContext(cityContext)

    return(
        <div>
            <h1>please login:</h1>
            <h2>test1 val: {test1}</h2>
            <h2>test2 val: {test2}</h2>
        </div>
    )

}