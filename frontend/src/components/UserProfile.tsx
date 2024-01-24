import './styles/Bomfunk.css';
import './styles/ProfilePages.css';
import InputFieldWithErrorMessage from './InputFieldWithErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useEffect, useState } from 'react';
import { User } from '../../../types/user';
import { useReservations } from '../hooks/useReservations';

/*
    UserProfile displays the user's account details and allows them
    to edit them. It calls validations from useProvideAuth to do this.
*/

interface FormData {
    name: string;
    email: string;
    password: string;
}

export default function UserProfile() {
    const { auth: getUser, isNewEmail, isValidEmail, isValidPassword } = useAuth();
    const { updateUser, deleteUser } = useUser();

    const [isEditing, setIsEditing] = useState(false);
    const [userState, setUserState] = useState(getUser);
    const [formState, setFormState] = useState<FormData | {}>({});

    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const [reservations, setReservations] = useState([]);

    const { fetchReservationsByUserId } = useReservations();

    useEffect(() => {
        async function fetchReservations() {
            try {
                const reservationsData = await fetchReservationsByUserId(getUser.id);
                setReservations(reservationsData);
            } catch (error) {
                //  TODO: add error handling
                console.error(error);
            }
        }

        fetchReservations();
    }, []);


    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }); //.replace(/ /g, '-');
    };

    const updateField = (field: keyof FormData) => (newValue: FormData[keyof FormData]) => {
        setFormState((formState: FormData) => ({
            ...formState,
            [field]: newValue,
        }));
    };

    const validateName = (name: string): [boolean, string] => {
        if (name.length < 2) {
            return [false, 'Name must be at least 2 characters'];
        } else {
            return [true, ''];
        }
    };

    const validateEmail = (email: string): [boolean, string] => {
        if (isValidEmail(email) && (isNewEmail(email) || email === getUser.email)) {
            return [true, ''];
        } else {
            if (isNewEmail(email)) {
                return [false, 'Invalid email format.'];
            } else {
                return [false, 'Email is already registered.'];
            }
        }
    };

    const validatePassword = (password: string): [boolean, string] => {
        if (isValidPassword(password)) {
            return [true, null];
        } else {
            return [false, 'Password does not meet criteria.'];
        }
    };

    const handleEditProfile = () => {
        setUserState(getUser);
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        if (nameValid && emailValid && passwordValid) {
            const updatedUser = {
                id: userState.id,
                ...formState,
            };
            console.log('updatedUser', updatedUser);

            updateUser(updatedUser as User);
            setIsEditing(false);
            setFormState({});
        }
    };

    const handleCancelChanges = () => {
        setIsEditing(false);
    };

    const handleDeleteProfile = () => {
        if (
            window.confirm(
                'This will delete your account, including any reviews you have posted. Are you sure?'
            )
        ) {
            deleteUser(userState.id);
        }
    };

    if (userState) {
        console.log('user createdat');
        console.log(userState.createdAt);
        console.log(typeof userState.createdAt);
    }

    return (
        <div className="orange_box_wrapper">
            {getUser ? (
                <>
                    <div className='user_profile_details_div'>
                        <h2>Your account</h2>
                        <p>Member since {formattedDate(getUser.createdAt)}</p>
                        {isEditing ? (
                            <>
                                <InputFieldWithErrorMessage
                                    id="user_profile_name"
                                    labelText="Name"
                                    initialValue={userState.name}
                                    validateValue={validateName}
                                    setValidationStatus={setNameValid}
                                    updateValue={updateField('name')}
                                />
                                <InputFieldWithErrorMessage
                                    id="user_profile_email"
                                    labelText="Email"
                                    initialValue={userState.email}
                                    validateValue={validateEmail}
                                    setValidationStatus={setEmailValid}
                                    updateValue={updateField('email')}
                                />
                                <InputFieldWithErrorMessage
                                    id="user_profile_password"
                                    type="password"
                                    labelText="Password"
                                    initialValue={''}
                                    validateValue={validatePassword}
                                    setValidationStatus={setPasswordValid}
                                    updateValue={updateField('password')}
                                />
                                <div className="user_profile_button_row">
                                    <button
                                        type="button"
                                        className="user_profile_button"
                                        id="user_profile_save"
                                        disabled={!(nameValid && emailValid && passwordValid)}
                                        onClick={handleSaveChanges}
                                    >
                                        Update profile
                                    </button>
                                    <button
                                        type="button"
                                        className="user_profile_button"
                                        id="user_profile_save"
                                        onClick={handleCancelChanges}
                                    >
                                        Cancel changes
                                    </button>
                                </div>
                                <p>
                                    Password must be 8+ characters, with 2 uppercase letters, 2
                                    numerals, 1 special character (!@#$&*) and 3 letters in lower case.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="user_profile_items">
                                    <p>
                                        <strong>Name: </strong>
                                        {getUser.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>
                                        {getUser.email}
                                    </p>
                                </div>
                                <div className="user_profile_button_row">
                                    <button
                                        type="button"
                                        className="user_profile_button"
                                        id="user_profile_delete"
                                        onClick={handleEditProfile}
                                    >
                                        Edit profile
                                    </button>
                                    <button
                                        type="button"
                                        className="user_profile_button"
                                        id="user_profile_delete"
                                        onClick={handleDeleteProfile}
                                    >
                                        Delete profile
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    { reservations.length !== 0 &&
                                        <div className='user_profile_reservations_div'>
                                        <h2>Reservations</h2>
                                        <ul>
                                            {reservations.map((reservation) => (
                                                <li key={reservation.id}>
                                                    {reservation.Showing['movie'].title} — {reservation.Showing['time']} ({reservation.numSeats} seats)
                                                </li>
                                            ))}
                                        </ul>
                                    </div> }
                </>
            ) : (
                <h2>Sign in to view your account</h2>
            )}
        </div>
    );
}
