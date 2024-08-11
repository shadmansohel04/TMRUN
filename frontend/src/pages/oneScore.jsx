import Footer from "../components/footer";
import DashHeader from "../components/dashHeader";
import { useLocation } from "react-router-dom";
import OneScoreBody from "../components/oneScoreBody";

export default function OneScorePage(){
    const location = useLocation()
    const {name, value} = location.state || {}

    return (
        <>
            <DashHeader />
            <OneScoreBody name= {name} value= {value}/>
            <Footer />
        </>
    )
}