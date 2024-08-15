import '../styles/signup.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'


export default function LoginSquare(){

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorBool, setBool] = useState(false)
    const [errormsg, setMsg] = useState('')

    function login(){
        axios.post('https://tmrun.onrender.com/home/login', {
            email: email,
            password: password
        }).then((response)=>{
            if(response.data.success == true){
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('id', response.data.userId)
                return navigate(`/userdash/${response.data.userId}`)
            }
            setBool(true)
            setMsg(response.data.msg)
        }).catch((err)=>{
            console.log(err)
        })
    }

    function checkEnter(event){
        if (event.key === "Enter"){
            login()
        }
    }

    return (
        <div className="signUpSquare">
            <h1>Login</h1>
            
            <label htmlFor="email">Email</label>
            <input value={email} type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter Email"/>
            
            <label htmlFor="password">Password</label>
            <input value={password} onKeyDown={(e) => {checkEnter(e)}} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Create a Password"/>

            <button onClick={login} className='button-28'>Login </button>

            {errorBool && <label className= 'errorMessage'>{errormsg}</label>}


        </div>
    )
}