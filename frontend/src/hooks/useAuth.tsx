import { useContext } from 'react';
import { User } from '../../../types/user';
import { AuthContext } from '../context/AuthProvider';
import axios from '../api/axios';

// CONSTS
// TODO: Rest of the consts
const LOGIN_URL = 'auth/login';

// TODO: Fix these types (any and Function aren't good)
interface UseAuthType {
    auth: User | null;
    setAuth: Function;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isValidPassword: (password: string) => boolean;
    isValidEmail: (email: string) => boolean;
    isNewEmail: (email: string) => Promise<boolean>;
    fetchUserByToken: (token: string) => Promise<User> | null;
    persist: boolean;
    setPersist: Function;
}

export const useAuth = (): UseAuthType => {
    const { auth, setAuth, persist, setPersist } = useContext(AuthContext);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password }), {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // This is required to include the cookie in the request
            });
            // console.log('response:', response);

            // Get access token
            const accessToken = response?.data?.accessToken;
            // Store access token with user in memory
            setAuth({ ...response.data.user, accessToken });
            // console.log('auth is:', auth);
            // console.log(response.data.user, accessToken);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        // console.log('attempting to logout');
        const accessToken = auth?.accessToken;

        if (accessToken !== null) {
            try {
                const response = await axios.post('http://localhost:5001/api/v1/auth/logout');
                // Check if the token was successfully destroyed
                if (response.status === 204 || response.status === 200) {
                    auth.accessToken = null;
                    // Remove user from memory
                    setAuth(null);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const fetchUserByToken = async (accessToken: string): Promise<User> => {
        try {
            const response = await axios.get('http://localhost:5001/api/v1/auth/me', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true, // Include cookie in the request
            });

            if (response.status === 200) {
                const fetchedUser = response.data;
                // TODO: Password shouldn't get stored in frontend
                // TODO: Store jwt with user data
                setAuth(fetchedUser);
                return fetchedUser;
            }
        } catch (error) {
            console.error('Error:', error);
        }
        return null;
    };

    const isValidPassword = (password: string): boolean => {
        const pw_regex =
            /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
        //  courtesy of https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
        // 8+ characters length
        // 2 letters in Upper Case
        // 1 Special Character (!@#$&*)
        // 2 numerals (0-9)
        // 3 letters in Lower Case

        return pw_regex.test(password);
    };

    const isNewEmail = async (email: string): Promise<boolean> => {
        const response = await axios.get(`http://localhost:5001/api/v1/user/exists/${email}`);
        return response.status === 200;
    };

    const isValidEmail = (email: string): boolean => {
        const em_regex =
            // TODO: Should we fix this?
            // eslint-disable-next-line no-control-regex
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        return em_regex.test(email);
    };

    return {
        auth,
        setAuth,
        login,
        logout,
        isValidPassword,
        isValidEmail,
        isNewEmail,
        fetchUserByToken: fetchUserByToken,
        persist,
        setPersist,
    };
};
