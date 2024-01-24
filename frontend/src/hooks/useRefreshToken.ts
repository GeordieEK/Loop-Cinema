import axios from '../api/axios';
import { useAuth } from './useAuth';
import { User } from '../../../types/user';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refreshToken', {
            withCredentials: true,
        });
        setAuth((prev: User) => {
            //TODO: Don't return the whole user object, just the access token
            return {
                ...prev,
                accessToken: response.data.accessToken,
                ...response.data.user,
            };
        });
        return response.data.accessToken;
    };

    return refresh;
};

export default useRefreshToken;
