import './styles/Bomfunk.css';
import './styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
    const { auth: getUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleSignOut() {
        await logout();
        navigate('/'); // Redirect to home page on logout
    }

    return (
        <nav>
            <div className="nav-left">
                <Link to="/">
                    <button className="homeBtn nav-button">Now Showing</button>
                </Link>
            </div>
            <div className="nav-right">
                {getUser ? (
                    //  display profile link + sign out button
                    <>
                        <Link to="/profile">
                            <button className="profileBtn nav-button">{getUser.name}</button>
                        </Link>
                        <button
                            className="signoutBtn nav-button"
                            onClick={handleSignOut}
                            data-testid="signoutBtn"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    //  display sign up button
                    <>
                        <Link to="/signin">
                            <button className="signInBtn nav-button">Sign In</button>
                        </Link>
                        <Link to="/signup">
                            <button className="signUpBtn nav-button">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
