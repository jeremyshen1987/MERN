import React, {useEffect, useState} from "react";
import { Link, Route } from "react-router-dom";
const bcrypt = require('bcryptjs')

export const Register = () => {


    const [hasRegistered, setHasRegistered] = useState(false)
    const [error, setError] = useState('')

    const RegForm = () => {

        return(

            <div >
                <h1 className="registration">Registration</h1>
                <form className="register_container" action="http://localhost:5000/test" method="POST">
                    
                    <div className="registration">
                        <label htmlFor="username">Username:
                            <input className="registration" name="username" placeholder="Username" type="text" required/>
                        </label>
                    </div>

                    <div className="registration">
                        <label htmlFor="email">Email:
                        <input className="registration" name="email" placeholder="Email" type="email" required/>
                        </label>
                    </div>

                    <div className="registration">
                        <label htmlFor="firstname">First Name:
                            <input className="registration" name="firstname" placeholder="First Name" type="text" required/>
                        </label>
                    </div>

                    <div className="registration">
                        <label htmlFor="lastname">Last Name:
                            <input className="registration" name="lastname" placeholder="Last Name" type="text" required/>
                        </label>
                    </div>
                    
                    <div className="registration">
                        <label htmlFor="password">Password:
                            <input className="registration" name="password" type="password" required/>
                        </label>
                    </div>

                    <div className="registration">
                        <label htmlFor="password">Confirm Password:
                            <input className="registration" name="password2" type="password" required/>
                        </label>
                    </div>
                    
                    <button id="signup" onClick={(e) => register(e)}>Sign Up</button>
                </form>

            </div>

        )
    }


    async function register(e){

        e.preventDefault()
        console.log(e.target.parentElement.username)

        const pw = e.target.parentElement.password.value
        const pw2 = e.target.parentElement.password2.value

        

        if(pw !== pw2){
            alert('Password mismatch')
            return
        }

        const formElm = e.target.parentElement
        const formData = {
            username: formElm.username.value,
            password: await bcrypt.hash(formElm.password.value, 10),
            firstname: formElm.firstname.value,
            lastname: formElm.lastname.value,
            email: formElm.email.value,
        }
        
        const formPOST = await fetch('http://localhost:5000/register', {

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
            return
        }

        setHasRegistered(true)
        
    }

    return(
        <div>

            {hasRegistered || <RegForm />}
            {error ? <h1 style={{color: "red", textAlign: 'center'}}>{error} already taken</h1> : ''}
            {hasRegistered && <h1>Registered! Please <Link to={'/login'}>Login</Link></h1>}

        </div>
    )
}