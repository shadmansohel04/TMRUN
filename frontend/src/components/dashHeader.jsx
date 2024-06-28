import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function DashHeader() {
    const navigate = useNavigate()
    const [openOrClose, setOpen] = useState(false)


    function logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        navigate('/')
    }
    const userId = localStorage.getItem('id')

    return (
        <header>
            <div className='leftSide'>
            { !openOrClose?  <a href="/" className='LOGO firstlogo'>TMRUN</a>: null}
            <a href="/" className='LOGO secondlogo'>TMRUN</a>

                <ul>
                    <li><a href={`/userdash/leader`}>Leaderboards</a></li>
                    <li><a href={`/userdash/${userId}/scores`}>My Stats</a></li>
                    <li><a href={"/userdash/" + userId}>Dash</a></li>
                </ul>
            </div>
            <div className='rightSide'>
                <button className='dropper' onClick={() => setOpen(prev => !prev)}>☰</button>

                <ul className={ openOrClose? 'dropdown fade-transition hidden': 'dropdown sizing fade-transition'}>

                    {openOrClose ? (
                        <>
                            <li><a href={`/userdash/leader`}>Leaderboards</a></li>
                            <li><a href={`/userdash/${userId}/scores`}>My Stats</a></li>
                            <li><a href={"/userdash/" + userId}>Dash</a></li>
                            <button onClick={logout} className='button-28 keepFit'>Logout</button>
                        </>
                    ) : null}

                </ul>

                <button onClick={logout} className='button-28 hideThis'>Logout</button>
            </div>
        </header>
    );
}

export default DashHeader;
