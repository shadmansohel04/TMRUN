import react, { useEffect, useState } from 'react'
import '../styles/homepage.css'
import { useNavigate } from 'react-router-dom'

export default function HomePage(){
    const navigate = useNavigate()
    const [padding, setPadd] = useState("30vh")
    const [opac, setOpac] = useState("0")

    function signUpPage(){
        navigate('/sign_up')
    }
    
    useEffect(()=>{
        setTimeout(() => {
            setPadd("7%")
            setOpac("100%")
        }, 15);
    }, [])

    return(
        <div className='homePage' style={{paddingTop: padding, opacity: opac }}>
            <div className='leftHome'>
                <button onClick={signUpPage} className='button-19'>GET STARTED</button>
            </div>
            <div className='rightHome'>
                <h1 className='gotNextText'>See how you score with TMRUN</h1>
                <h4 className='tmyEmailStravaBlurb'>All you need is a email and a Strava account</h4>
            </div>
        </div>
    )
} 

