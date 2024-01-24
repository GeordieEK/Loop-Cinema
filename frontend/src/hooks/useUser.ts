import { User } from '../../../types/user';
import { useAuth } from './useAuth';
import { useReviews } from './useReviews';
import axios from '../api/axios';
import { AxiosResponse } from 'axios';

export const useUser = () => {
    const { deleteAllReviewsByUser } = useReviews();
    const { auth, setAuth, logout } = useAuth();
    const accessToken = auth?.accessToken;

    const addUser = (name: string, email: string, password: string): Promise<AxiosResponse> => {
        const user = { name, email, password };
        return axios
            .post('user', user, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                return res.data;
            });
    };

    const updateUser = (updatedUser: User): Promise<AxiosResponse> => {
        console.log('Updating user:', updatedUser);

        return axios
            .put(`/user/${updatedUser.id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            })
            .then((res) => {
                // Update user in auth context
                setAuth((prev: User) => {
                    return {
                        ...prev,
                        ...res.data,
                    };
                });
                return res.data;
            });
    };

    const deleteUser = async (userId: number): Promise<AxiosResponse> => {
        try {
            const res = await axios.delete(`user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            deleteAllReviewsByUser(userId);
            logout();
            return res;
        } catch (error) {
            console.log('Error deleting user');
            throw error;
        }
    };

    const getUserById = (userId: number): Promise<AxiosResponse> => {
        return axios.get(`user/${userId}`).then((res) => {
            return res.data;
        });
    };

    return { addUser, updateUser, deleteUser, getUserById };
};
