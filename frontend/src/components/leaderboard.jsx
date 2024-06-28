import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/leaderboard.css'

export default function EachLeaderboard() {
    const [highRiser, setHighRiser] = useState([])
    const [consistentScore, setConsistent] = useState([])
    const [pacerScores, setPacerScore] = useState([])
    const [momentumScore, setMomentumScore] = useState([])
    const [times5k, set5k] = useState([])
    const [times2k, set2k] = useState([])
    const [times10k, set10k] = useState([])
    const [times20k, set20k] = useState([])

    function times_20k(){
        return times20k.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    function times_10k(){
        return times10k.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    function times_2k(){
        return times2k.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    function times_5k(){
        return times5k.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    function high_riser() {
        return highRiser.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.scores != null? each.person: null}</h4>
                <h4>{each.scores != null? each.scores: null}</h4>
            </div>
        ));
    }

    function consistent_scores() {
        return consistentScore.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    function pacer_scores() {
        return pacerScores.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    function momentum_scores() {
        return momentumScore.map((each, index) => (
            <div key={index} className="leaderItem">
                <h4>{each.score != null? each.person: null}</h4>
                <h4>{each.score != null? each.score: null}</h4>
            </div>
        ));
    }

    useEffect(() => {
        axios.get(`https://tmrun.onrender.com/userdash/leader`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {
            setHighRiser(response.data.allPeopleData);
            setConsistent(response.data.consistentLeaderArray)
            setPacerScore(response.data.pacerLeader)
            setMomentumScore(response.data.momentumArray)
            set5k(response.data.array5k)
            set2k(response.data.array2k)
            set10k(response.data.array10k)
            set20k(response.data.array20k)
        });
    }, []);

    return (
        <div className="leaderBoardContainer">
            
            <h1>Regular Leaderboards</h1>

            <div className="horizontalBlockLeader">
                <div className="leaders">
                    <h2>2k</h2>
                    {times_2k()}
                </div>

                <div className="leaders">
                    <h2>5k</h2>
                    {times_5k()}
                </div>

            </div>

            <div className="horizontalBlockLeader">
                <div className="leaders">
                    <h2>10k</h2>
                    {times_10k()}
                </div>

                <div className="leaders">
                    <h2>20k</h2>
                    {times_20k()}
                </div>

            </div>

            <h1>TMRUN Leaderboards</h1>

            <div className="horizontalBlockLeader">
                <div className="leaders">
                    <h2>High Riser</h2>
                    {high_riser()}
                </div>

                <div className="leaders">
                    <h2>Captain Consistent</h2>
                    {consistent_scores()}
                </div>

            </div>

            <div className="horizontalBlockLeader">
                <div className="leaders">
                    <h2>Pacer</h2>
                    {pacer_scores()}
                </div>

                <div className="leaders">
                    <h2>Momentum</h2>
                    {momentum_scores()}
                </div>

            </div>
            


        </div>
    );
}
