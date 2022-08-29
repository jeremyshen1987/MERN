import React, {useState, useContext} from 'react'
import { mainContext } from './RouteSwitch'

export const Auth = () => {
    const {authUser, setAuthUser} = useContext(mainContext)
    const [error, setError] = useState('')

    const handleLogin = async (e) => {

        e.preventDefault()
        const formSelector = document.querySelector('.login_container')
        const uname = formSelector.username.value
        const pw = formSelector.password.value

        const formData = {
            username: uname,
            password: pw
        }

        console.log(formData)


        const response = await fetch('http://localhost:5000/login', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        
        const userObj = await response.json()

        if(userObj.error){
            setError(userObj.error)
            return
        }
        setError('')
        setAuthUser(userObj)
        return

    }

    const LoginForm = () => {
        return(
            <div>
            <h1 className='login_banner'>Please Login:</h1>
            <form className='login_container'>
                <div className='login'>
                    <label >Username: </label>
                    <input name='username' className='login' required></input>
                </div>

                <div className='login'>
                    <label>Password: </label>
                    <input name='password' type='password' className='login'></input>
                </div>

                <div className='login'>
                    <button id='login' onClick={(e) => handleLogin(e)}>Login</button>
                </div>
                
            </form>
            

        </div>
        )
    }


    return(

        <div>
            {authUser.username ? '' : <LoginForm />}
            {authUser.username && <h1>Welcome Back, {authUser.username}</h1>}
            <h1 style={{color: "red", textAlign: 'center'}}>{error}</h1>
            
        </div>


    )

}