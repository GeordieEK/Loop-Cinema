import './styles/Bomfunk.css';
import './styles/ProfilePages.css';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const { auth, login, isNewEmail, isValidEmail, isValidPassword } = useAuth();
    const { addUser } = useUser();
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setFormValues((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    };

    useEffect(() => {
        if (success) {
            login(formValues.email, formValues.password);

            navigate('/profile', { replace: true });
            // clear form
            setFormValues({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [auth, success, formValues.email, formValues.password, navigate, login]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const { name, email, password, confirmPassword } = formValues;
        if (event) event.preventDefault();    

        let isAvailableEmail = false;
        try {
            isAvailableEmail = await isNewEmail(email);
        } catch (error) {
            console.error('Could not check whether email exists:', error);
        }

        // Input validation
        if (!name || !email || !password || !confirmPassword) {
            setMessage('Please fill in all fields');
        } else if (!isAvailableEmail) {
            setMessage('Email is already registered.');
        } else if (!isValidEmail(email)) {
            setMessage('Invalid email format.');
        } else if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else if (!isValidPassword(password)) {
            setMessage('Password does not meet criteria.');
        } else {
            //TODO: Pass user details as request body
            addUser(name, email, password);

            alert(`Thanks for joining us ${name}`);

            setSuccess(true);
        }
    };

    return (
        <div className="orange_box_wrapper">
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit} className="signUpForm" noValidate>
                <div className="orange_box_formfield">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="orange_box_formfield">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="orange_box_formfield">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="orange_box_formfield">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formValues.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="user_profile_button_row">
                    <button type="submit">Submit</button>
                    {message && <p className="error_message">{message}</p>}
                </div>
            </form>
            <p>
                Password must be 8+ characters, with 2 uppercase letters, 2 numerals, 1 special
                character (!@#$&*) and 3 letters in lower case.
            </p>
        </div>
    );
}

export default SignUpForm;
