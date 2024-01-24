import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignInForm from '../../components/SignInForm';
import { AuthProvider } from '../../context/AuthProvider';
import Navbar from '../../components/Navbar';

window.alert = jest.fn();

//TODO: Add data-testid to elements and use getByTestId instead of getByLabelText

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mock login inside use Auth
jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        login: jest.fn((email, password) => {
            if (email === 'test@test.com' && password === 'testpassword') {
                return Promise.resolve(true); // Login succeeds
            } else {
                return Promise.resolve(false); // Login fails
            }
        }),
        auth: {
            name: 'test',
            email: 'test@test.com',
            password: 'testpassword',
        },
    }),
}));

describe('Navbar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test that Navbar renders signout button when user is logged in (as opposed to signin button)
    test('renders signOut button when user is logged in', async () => {
        const { useAuth } = require('../../hooks/useAuth');

        const mockLogin = useAuth().login;
        (useAuth().login as jest.Mock) = mockLogin;

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Navbar />
                    <SignInForm />
                </AuthProvider>
            </MemoryRouter>
        );

        const logoutButton = await screen.findByTestId('signoutBtn');
        expect(logoutButton).toBeInTheDocument();
    });
});
