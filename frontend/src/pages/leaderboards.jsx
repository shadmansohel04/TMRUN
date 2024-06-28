import React from "react";
import DashHeader from '../components/dashHeader'
import Footer from '../components/footer'
import EachLeaderboard from "../components/leaderboard";

export default function LeaderBoardsPage(){
    return(
        <>
            <DashHeader />
            <EachLeaderboard/>
            <Footer />
        </>
    )
}