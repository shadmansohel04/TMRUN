import axios from "axios";
import '../styles/userScores.css'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function(){
    const {userId} = useParams('userId')
    const [highRiser, setHighRiser] = useState('')
    const [consistencyScore, setConsistencyScore] = useState('')
    const [am_or_pm, setAMPM] = useState('')
    const [amPMScore, setAMPMScore] = useState('')
    const [earlyOrlatePusher, setPusher] = useState('')
    const [earlyOrlatePusherScore, setPusherScore] = useState('')
    const [pacerScore, setPacerScore] = useState('')
    const [showSwitch, setShowSwitch]= useState('')
    const [momentumScore, setMomentum] = useState('')
    const [time2k, set2k] = useState('')
    const [time5k, set5k] = useState('')
    const [time10k, set10k] = useState('')
    const [time20k, set20k] = useState('')
    const [imrover, setImprover] = useState('')
    const [calories, setCalories] = useState('')

    useEffect(()=>{
        axios.get(`https://tmrun.onrender.com/userdash/home/${userId}/scores`, {
            headers:{
                Authorization: localStorage.getItem('token')
            }
        }).then((response) =>{
            setHighRiser(response.data.elevationScore)
            setConsistencyScore(response.data.consistencyScore)
            if(response.data.AM_PM_score.time == "PM"){
                setAMPM("Night Owl")
            }
            else if(response.data.AM_PM_score == "AM"){
                setAMPM("Early Bird")
            }
            else{
                setAMPM("Equal Time Runner")
            }
            setAMPMScore(response.data.AM_PM_score.score)    
            setPusher(response.data.timePusher.time)    
            setPusherScore(response.data.timePusher.value)   
            setPacerScore(response.data.pacerScore) 
            setShowSwitch(response.data.leaderMSG)
            setMomentum(response.data.momentumScore)
            set2k(response.data.regularScores.time2k)
            set5k(response.data.regularScores.time5k)
            set10k(response.data.regularScores.time10k)
            set20k(response.data.regularScores.time20k)
            setImprover(response.data.improvement)
            setCalories(response.data.calories)
        })
    }, [])

    function switchLeader(){
        axios.post("https://tmrun.onrender.com/userdash/home/switchLeader", 
            {
                userId: userId,
                newLeader: showSwitch
            },
            {
                headers:{
                    Authorization: localStorage.getItem('token')
                }
            }
        ).then((response)=>{

            if(response.data.success == true){
                setShowSwitch(response.data.newLeader)
            }

        })
    }

    function pusherMessage(){
        if(earlyOrlatePusher == "Early Pusher"){
            return `You're an Early Pusher since ${earlyOrlatePusherScore}% of your runs have your fastest segment near the beginning.`
        }
        else if (earlyOrlatePusher == "Late Finisher"){
            return `You're a Late Pusher since ${earlyOrlatePusherScore}% of your runs have your fastest segment near the end.`
        }
        else{
            return  `You're a Day To Day Pusher since your best kilometer during your runs is equally at the start of your runs as well as near the end.`
        }
    }

    return(
        <div className="allScoreBody">
            <div className="allScoreContainer">
            <h1 id="TitlesInScores">Regular Scores</h1>

            <div className="horizontalScores">    
                    <div className="EachScore">
                        <h2>2k</h2>
                        <h4>{time2k}</h4>
                        <p>Your average pace for your recent 2km runs</p>
                    </div>
                    <div className="EachScore">
                        <h2>5k</h2>
                        <h4>{time5k}</h4>
                        <p>Your average pace for your recent 5km runs</p>
                    </div>
                </div>
                <div className="horizontalScores">
                    <div className="EachScore">
                        <h2>10k</h2>
                        <h4>{time10k}</h4>
                        <p>Your average pace for your recent 10km runs</p>
                    </div>
                    <div className="EachScore">
                        <h2>20k</h2>
                        <h4>{time20k}</h4>
                        <p>Your average pace for your recent 20km runs</p>
                    </div>
                </div>

                <h1 id="TitlesInScores">TMRUN Scores</h1>

                <div className="horizontalScores">    
                    <div className="EachScore">
                        <h2>High Riser</h2>
                        <h4>{highRiser}</h4>
                        <p>The high riser score is based on how much elevation you gain per run</p>
                    </div>
                    <div className="EachScore">
                        <h2>Captain Consistent</h2>
                        <h4>{consistencyScore}</h4>
                        <p>The consistency score is based on how many times you've run in the last month.
                             It is scored from 0-100.
                        </p>
                    </div>
                </div>
                <div className="horizontalScores">
                    <div className="EachScore">
                        <h2>Pacer</h2>
                        <h4>{pacerScore}</h4>
                        <p>Your pacer score is made from looking at your fastest and slowest km 
                            from your most recent runs. A good pacer score means that you have a 
                            small range between your slowest and fastest kms.</p>
                    </div>
                    <div className="EachScore">
                        <h2>Momentum</h2>
                        <h4>{momentumScore}</h4>
                        <p>Your momentum score is based on your maximum momentum from your past runs. 
                            Higher the score, the more unstoppable you are. A real force to recon with</p>
                    </div>
                </div>

                <h1 id="TitlesInScores">TMRUN Percentages</h1>
                <div className="horizontalScores">
                    <div className="EachScore">
                        <h2>{am_or_pm}</h2>
                        <h4>{amPMScore + "%"}</h4>
                        <p>Your a {am_or_pm} since you run {amPMScore}% of the time {am_or_pm == "Night Owl" ? "in the evening": "in the day" }</p>
                    </div>
                    <div className="EachScore">
                        <h2>{earlyOrlatePusher}</h2>
                        <h4>{earlyOrlatePusherScore}%</h4>
                        <p> {pusherMessage()} </p>
                    </div>
                </div>

                <div className="horizontalScores">
                    <div className="EachScore">
                        <h2>Improver</h2>
                        <h4>{imrover + "%"}</h4>
                        <p>When comparing your most recent run's average pace to your last month's pace, you've changed {imrover}% </p>
                    </div>
                    <div className="EachScore">
                        <h2>Meal Runner</h2>
                        <h4>{calories}%</h4>
                        <p>Judging from your most recent runs, you burn a full meal's worth of calories (500 calories), {calories}% of the time</p>
                    </div>
                </div>


                <button onClick={switchLeader} className="button-86">{showSwitch}</button>

            </div>
        </div>
    )
}