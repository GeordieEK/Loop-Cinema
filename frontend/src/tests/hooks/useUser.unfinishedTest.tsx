import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthProvider';
import axios from 'axios';
import { useUser } from '../../hooks/useUser';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockResolvedValue(Promise.resolve({ data: {} }));
mockedAxios.get.mockResolvedValue(Promise.resolve({ data: {} }));
mockedAxios.delete.mockResolvedValue(Promise.resolve({ data: {} }));

// TODO: Fix any types on wrappers

describe('useUser', () => {
    it('adds a user', async () => {
        const userData = { name: 'John', email: 'john@example.com', password: 'password123' };
        const response = { data: userData };
        mockedAxios.post.mockResolvedValue(response);
        const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
        const { result } = renderHook(() => useUser(), { wrapper });
        await act(() => {
            result.current.addUser(userData.name, userData.email, userData.password);
        });
        await waitFor(async () => {
            await result.current.addUser(userData.name, userData.email, userData.password);
        });
        expect(mockedAxios.post).toHaveBeenCalledWith('user', userData, {
            headers: {
                Authorization: 'Bearer undefined',
            },
        });
        expect(result.current).toEqual(response.data);
    });

    // it('updates a user', async () => {
    //     const updatedUser = {
    //         id: 1,
    //         name: 'John',
    //         email: 'john@example.com',
    //         password: 'mockPassword',
    //         accessToken: 'mockToken',
    //         date_joined: '2000-01-01',
    //     };
    //     const response = { data: updatedUser };
    //     mockedAxios.put.mockResolvedValue(response);
    //     const { result } = renderHook(() => useUser());
    //     act(() => {
    //         result.current.updateUser(updatedUser);
    //     });
    //     await waitFor(async () => {
    //         await result.current.updateUser(updatedUser);
    //     });
    //     expect(mockedAxios.put).toHaveBeenCalledWith(`/user/${updatedUser.id}`, updatedUser, {
    //         headers: {
    //             Authorization: 'Bearer undefined',
    //         },
    //         withCredentials: true,
    //     });
    //     expect(result.current).toEqual(response.data);
    // });

    // it('deletes a user', async () => {
    //     const userId = 1;
    //     const response = { data: {} };
    //     mockedAxios.delete.mockResolvedValue(response);
    //     const { result } = renderHook(() => useUser());
    //     act(() => {
    //         result.current.deleteUser(userId);
    //     });
    //     await waitFor(async () => {
    //         await result.current.deleteUser(userId);
    //     });
    //     expect(mockedAxios.delete).toHaveBeenCalledWith(`user/${userId}`, {
    //         headers: {
    //             Authorization: 'Bearer undefined',
    //         },
    //     });
    //     expect(result.current).toEqual(response);
    // });

    // it('gets a user by ID', async () => {
    //     const userId = 1;
    //     const user = {
    //         id: userId,
    //         name: 'John',
    //         email: 'john@example.com',
    //         password: 'password123',
    //     };
    //     const response = { data: user };
    //     mockedAxios.get.mockResolvedValue(response);
    //     const { result } = renderHook(() => useUser());
    //     act(() => {
    //         result.current.getUserById(userId);
    //     });
    //     await waitFor(async () => {
    //         await result.current.getUserById(userId);
    //     });
    //     expect(mockedAxios.get).toHaveBeenCalledWith(`user/${userId}`);
    //     expect(result.current).toEqual(response.data);
    // });
});
