import Header from "../components/header";
import Footer from "../components/footer";
import '../styles/verifyEmail.css'

export default function checkEmailPage(){
    return(
        <>
            <Header />
            <div className="checkemailblock">
                <h1>Please Verify your Email</h1>
                <h3>If you have issues please contact us</h3>
            </div>
            <Footer />
        </>
    )
}