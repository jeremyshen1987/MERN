import React, {useState, useContext, useRef} from 'react'
import { Link } from 'react-router-dom'
import { mainContext } from './RouteSwitch'
import Helper from './Helper'

const Auth = () => {

    const {authUser, setAuthUser} = useContext(mainContext)
    const [error, setError] = useState('')

    const overlay = useRef()
    const uname = useRef()
    const pw = useRef()

    const handleLogin = async (e) => {

        e.preventDefault()


        const formData = {
            username: uname.current.value,
            password: pw.current.value
        }

        toggle_overlay()

        //https://rich-rose-goose-cape.cyclic.app///

        const response = await fetch('https://rich-rose-goose-cape.cyclic.app/login', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        
        const userObj = await response.json()

        if(userObj.error){
            setError(userObj.error)
            toggle_overlay()
            return
        }

        setError('')
        setAuthUser(userObj)
        toggle_overlay()

        return

    }

    const LoginForm = () => {
        return(
            <div>
                <h1 className='login_banner'>Please Login:</h1>
                <form className='login_container'>
                    <div className='login'>
                        <label >Username: </label>
                        <input name='username' className='login' ref={uname} required></input>
                    </div>

                    <div className='login'>
                        <label>Password: </label>
                        <input name='password' type='password' ref={pw} className='login'></input>
                    </div>

                    <div className='login'>
                        <button id='login' onClick={(e) => handleLogin(e)}>Login</button>
                    </div>
                    
                </form>
                <h3 className='register_link'>Don't have an account? &nbsp; &nbsp;<Link to={'/register'}>Register</Link></h3>
            </div>
        )
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

        <div className='login_container'>
            {authUser.username ? '' : <LoginForm />}
            {authUser.username && <h1>Welcome Back, {authUser.username}. <Link to={'/dashboard'}>Your Orders</Link></h1>}
            <h1 style={{color: "red", textAlign: 'center'}}>{error}</h1>
            <Helper overlay_text='Login... Please Wait' ref={overlay}/>
        </div>


    )

}

export default Auth