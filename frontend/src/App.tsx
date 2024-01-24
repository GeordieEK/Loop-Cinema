import React from 'react';
import './components/styles/Globals.css';
import Home from './components/Home';
import { InitData } from './components/InitData';
import Header from './components/Header';
import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersistLogin from './components/PersistLogin';
// import ControlPanel from './components/ControlPanel';

function App() {
    return (
        <main className="App">
            <InitData />
            <Router>
                <div className="flex-wrapper">
                    <div className="container">
                        <div className="header_and_nav">
                            <Header />
                            <Navbar />
                        </div>
                        {/* <ControlPanel /> */}
                        <Routes>
                            <Route element={<PersistLogin />}>
                                {/* //TODO: Routes should be in a separate file */}
                                {/* TODO: Some routes need to be protected */}
                                <Route path="/" element={<Home />} />
                                <Route path="/signup" element={<SignUpForm />} />
                                <Route path="/signin" element={<SignInForm />} />
                                <Route path="/profile" element={<UserProfile />} />
                            </Route>
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </main>
    );
}

export default App;
