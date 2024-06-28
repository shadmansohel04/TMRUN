import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/dashBody.css';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserDashBody() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [lastThreeRuns, setRuns] = useState([
        {
            time: "awkward...",
            distance: null
        },
        {
            time: "awkward...",
            distance: null
        },
        {
            time: "awkward...",
            distance: null
        }
    ])

    const [loading, setLoading] = useState(true);
    const { userId } = useParams();

    function toScores(){
        navigate(`/userdash/${userId}/scores`)
    }

    useEffect(() => {
        axios.get(`https://tmrun.onrender.com/userdash/home/${userId}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then((response) => {
            if (response.data.success === false) {
                return navigate('/login');
            }
            setName(response.data.user);
            const newStrava = lastThreeRuns.map((prev, index) => {
                const runData = response.data.data[index];
                return {
                  time: runData ? (runData.time) + " min" : "awkward...",
                  distance: runData ? (runData.distance) + " km" : null
                };
              });
              
            setRuns(newStrava)
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            setLoading(false); // stop loading even if there is an error
        });
    }, []);

    function recentRuns() {
        return (
            <div className="EachUserleaderboard">
                { lastThreeRuns.map((each, index)=>(
                    <div className="circlePerson" key={index}>
                        <h3>{each.time}</h3>
                        <h4>{each.distance}</h4>
                  </div>
                )) }
            </div>
        );
    }

    function bestRanks() {
        return (
            <div className="EachUserleaderboard">
                <div className="circlePerson">
                    <h3>Consistency</h3>
                    <h4>86</h4>
                </div>
                <div className="circlePerson">
                    <h3>Final Push</h3>
                    <h4>55</h4>
                </div>
                <div className="circlePerson">
                    <h3>Early Bird</h3>
                    <h4>78</h4>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="LOADING">
                loading...
            </div>
        );
    }

    return (
        <div className="userDashBody userBackground">
            <div className="leftUserDash">
                <h1>Hey {name}!</h1>
                <button onClick={toScores} id="buttonForUserDash" className="button-40">All Scores</button>
            </div>
            <div className="rightUserDash">
                <h2>Recent Runs</h2>
                    {recentRuns()}
                <h2>Best Scores</h2>
                    {bestRanks()}
            </div>
        </div>
    );
}
