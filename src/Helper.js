import React, { forwardRef } from "react";
import './Helper.css'


const Helper = forwardRef( function Helper(props, ref){

    const {overlay_text, ...otherprops} = props

    return(
        <>

        <div id="overlay" ref={ref}>
            <h1 >{overlay_text}</h1>
        </div>

        </>
    )
})

export default Helper