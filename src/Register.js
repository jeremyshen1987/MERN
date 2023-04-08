import React, {useEffect, useState, useRef} from "react";
import { Link, Route } from "react-router-dom";
import Helper from "./Helper";
const bcrypt = require('bcryptjs')

const Register = () => {


    const [hasRegistered, setHasRegistered] = useState(false)
    const [error, setError] = useState('')
    const [userInfo, setUserInfo] = useState({})
    const overlay = useRef()

    function handleChange(e){
    
        console.log('change')

        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }


    async function register(e){

        e.preventDefault()
        toggle_overlay()

        if(userInfo.password !== userInfo.password2){
            alert('Password mismatch')
            return
        }

        const formData = {
            ...userInfo,
            password: await bcrypt.hash(userInfo.password, 10)
        }
        

        const formPOST = await fetch('https://rich-rose-goose-cape.cyclic.app/register', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const response = await formPOST.json()

        if(response.error){

            const errorKey = Object.keys(response.error.keyValue)[0]
            
            setError(errorKey)
            toggle_overlay()
            return
        }

        setError('')
        setHasRegistered(true)
        toggle_overlay()
        
    }



    function toggle_overlay(){
        
        console.log(overlay.current)

        if(overlay.current.style.display == 'block'){
            overlay.current.style.display = 'none'
            return
        }
        overlay.current.style.display = 'block'

    }

    return(

        <>  
            <div className="registration_container">

                {hasRegistered ||             
                
                <div >
                    <h1 className="registration">Registration</h1>
                    <form className="register_container" action="" method="POST">
                        
                        <div className="registration">
                            <label htmlFor="username">Username:
                                <input onChange={handleChange} className="registration" name="username" placeholder="Username" type="text" required/>
                            </label>
                        </div>
        
                        <div className="registration">
                            <label htmlFor="email">Email:
                            <input onChange={handleChange} className="registration" name="email" placeholder="Email" type="email" required/>
                            </label>
                        </div>
        
                        <div className="registration">
                            <label htmlFor="firstname">First Name:
                                <input onChange={handleChange} className="registration" name="firstname" placeholder="First Name" type="text" required/>
                            </label>
                        </div>
        
                        <div className="registration">
                            <label htmlFor="lastname">Last Name:
                                <input onChange={handleChange} className="registration" name="lastname" placeholder="Last Name" type="text" required/>
                            </label>
                        </div>
                        
                        <div className="registration">
                            <label htmlFor="password">Password:
                                <input onChange={handleChange} className="registration" name="password" type="password" required/>
                            </label>
                        </div>
        
                        <div className="registration">
                            <label htmlFor="password">Confirm Password:
                                <input onChange={handleChange} className="registration" name="password2" type="password" required/>
                            </label>
                        </div>
                        
                        <button id="signup" onClick={(e) => register(e)}>Sign Up</button>
                    </form>
                    <h3 className='login_link'>Already have an account? &nbsp; &nbsp;<Link to={'/login'}>Login</Link></h3>
    
                </div>}



                {error ? <h1 style={{color: "red", textAlign: 'center'}}>{error} already taken</h1> : ''}

                {hasRegistered && <h1>Registered! Please <Link to={'/login'}>Login</Link></h1>}

                <Helper overlay_text = 'Waking up backend... please wait' ref={overlay}/>
            </div>
        </>

    )
}



export default Register