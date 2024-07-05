import { useState } from 'react'
import axios from 'axios'
import '../styles/signup.css'
import { useNavigate } from 'react-router-dom'

export default function signUpSquare(){

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [errorBool, setBool] = useState(false)
    const [errormsg, setMsg] = useState('')

    function signUp(){
        axios.post('https://tmrun.onrender.com/home/sign_up',{
            username,
            password,
            email
        }).then((response)=>{
            if(response.data.success == true){
                return navigate('/check_email')
            }
            setBool(true)
            setMsg(response.data.msg)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <div className="signUpSquare">
            <h1>Sign Up</h1>
            <label htmlFor="email">Email</label>

            <input value={email} type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter Email"/>
            
            <label htmlFor="username">Username</label>
            
            <input value={username} onChange={(e)=>{setUsername(e.target.value)}} type="text" placeholder="Create Username"/>

            <label htmlFor="password">Password</label>
          
            <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Create a Password"/>
                      
            <button onClick={signUp} className='button-28'>Create Account</button>

            {errorBool && <label className= 'errorMessage'>{errormsg}</label>}

        </div>
    )
}