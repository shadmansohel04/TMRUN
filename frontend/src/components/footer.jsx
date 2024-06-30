import '../styles/footer.css'
import powered from '../assets/powered.png'


export default function Footer(){
    return(
        <footer>
            <div className='leftFOOT'>
                <a href="/" className='LOGO'>TMRUN</a>
                <img src={powered} className='powered' alt="powered by strava" />
            </div>
            <h3>created by <a href='https://shadmansohel04.github.io/PortfolioWebsite/' className='shadmanSohel'>Shadman Sohel</a> </h3>
        </footer>
    )
}