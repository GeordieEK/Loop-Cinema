import './styles/Bomfunk.css';
import './styles/ProfilePages.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { auth: getUser, login, logout, persist, setPersist } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        //TODO: Submit by hitting enter key as well as clicking button
        if (event) event.preventDefault();

        const success = await login(email, password);
        if (success) {
            alert('Welcome back!');
            navigate('/profile', { replace: true });
        } else {
            setMessage('Incorrect username or password');
        }
    }

    const handleLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault();
        logout();
    };

    // const togglePersist = () => {
    //     setPersist((prev: User) => !prev);
    // };

    useEffect(() => {
        localStorage.setItem('persist', persist ? 'true' : 'false');
    }, [persist]);

    return (
        <div className="orange_box_wrapper">
            <section className="popup">
                <h2>Sign in</h2>
                <form className="signInForm">
                    <div className="orange_box_formfield">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="orange_box_formfield">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="user_profile_button_row">
                        {!getUser ? (
                            <button type="button" onClick={handleLogin}>
                                Login
                            </button>
                        ) : (
                            <button type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        )}
                        {/* <div className="persistCheck">
                            <input
                                type="checkbox"
                                id="persist"
                                onChange={togglePersist}
                                checked={persist}
                            />
                            <label htmlFor="persist">Trust This Device</label>
                        </div> */}
                    </div>
                </form>
                {message && <p className="error_message">{message}</p>}
            </section>
        </div>
    );
}

export default SignInForm;
