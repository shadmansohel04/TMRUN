import { useState } from "react"
import '../styles/contact.css'
import axios from 'axios'

export default function contactBody(){
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    function sendEmail(){
        axios.post("https://tmrun.onrender.com/home/contact", {
            email: email,
            subject: subject,
            message: message
        }).then((response)=>{
            alert(response.data.success == true? "Sent": "Error, try again later")
        })
    }

    return(
        <div className="contactBody">
            <h1>Hit Us Up!</h1>
            <div className="contactForm">
                <h2>Email</h2>
                <input value={email} type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter Email"/>
                <h2>Subject</h2>
                <input value={subject} type="email" onChange={(e)=>{setSubject(e.target.value)}} placeholder="Enter Subject"/>
                <h2>Message</h2>
                <textarea value={message} onChange={(e)=>{setMessage(e.target.value)}} id="message" rows="5" placeholder="Message"></textarea>
                <button className="button-6" onClick={sendEmail}>Send</button>
            </div>
        </div>
    )
}