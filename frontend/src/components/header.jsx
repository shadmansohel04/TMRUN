import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

function Header() {
    const personID = localStorage.getItem('id');
    const navigate = useNavigate();
    const [theurl, setUrl] = useState('/login');
    const [openOrClose, setOpen] = useState(false)

    useEffect(() => {
        if (personID) {
            setUrl(`/userdash/${personID}`);
        } else {
            setUrl('/login');
        }
    }, [personID]);

    function login() {
        navigate('/login');
    }

    return (
        <header>
            <div className='leftSide'>
                { !openOrClose?  <a href="/" className='LOGO firstlogo'>TMRUN</a>: null}
                <a href="/" className='LOGO secondlogo'>TMRUN</a>

                <ul>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href={theurl}>Dash</a></li>
                </ul>
            </div>
            <div className='rightSide'>
                <button className='dropper' onClick={() => setOpen(prev => !prev)}>☰</button>
                <ul className={ openOrClose? 'dropdown showNAV': 'dropdown'}>
                    <li className={ openOrClose? 'showText': 'hideText'}><a href="/about">About</a></li>
                    <li className={ openOrClose? 'showText': 'hideText'}><a href="/contact">Contact</a></li>
                    <li className={ openOrClose? 'showText': 'hideText'}><a href={theurl}>Login</a></li>
                </ul>                
                <button onClick={login} className='button-28 hideThis'>Login</button>
            </div>
        </header>
    );
}

export default Header;
