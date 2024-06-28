import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import AboutPage from './pages/about'; 
import SignUpPage from './pages/signupPage';
import CheckEmailPage from './pages/checkYourEmail';
import LoginPage from './pages/loginPage';
import UserDashPage from './pages/userDash';
import LeaderBoardsPage from './pages/leaderboards';
import AllScoresPage from './pages/allScoresPage';
import ContactPage from './pages/contactPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/sign_up' element={ <SignUpPage /> } />
        <Route path='/check_email' element= { <CheckEmailPage/> } />
        <Route path='/login' element= { < LoginPage /> } /> 
        <Route path='/userdash/:userId' element= { < UserDashPage />} />
        <Route path='/userdash/:userId/scores' element = { <AllScoresPage /> } />
        <Route path='/userdash/leader' element= { <LeaderBoardsPage /> }/>
        <Route path='/contact' element= { <ContactPage /> }/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
