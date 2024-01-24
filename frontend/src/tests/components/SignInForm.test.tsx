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
    }),
}));

describe('SignInForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // test that SignInForm renders without crashing
    test('renders without crashing', () => {
        render(
            <AuthProvider>
                <SignInForm />
            </AuthProvider>
        );
    });

    // test that user can login successfully given correct email and password
    test('ensure mockLogin function working as expected', async () => {
        const { useAuth } = require('../../hooks/useAuth'); // Import the mocked useAuth

        const mockLogin = useAuth().login; // Get mockLogin from useAuth
        (useAuth().login as jest.Mock) = mockLogin;

        const result = await mockLogin('test@test.com', 'testpassword');
        expect(result).toBe(true);
    });

    // TODO: page seems to change too quickly for event to be caught

    // test('calls login on button click', async () => {
    //     const { useAuth } = require('../../hooks/useAuth'); // Import the mocked useAuth

    //     // Use TestAuthProvider to wrap SignInForm during rendering
    //     render(
    //         <AuthProvider>
    //             <SignInForm />
    //         </AuthProvider>
    //     );

    //     const emailField = screen.getByLabelText('Email:');
    //     const passwordField = screen.getByLabelText('Password:');
    //     const loginButton = screen.getByText('Login');

    //     fireEvent.change(emailField, { target: { value: 'test@test.com' } });
    //     fireEvent.change(passwordField, { target: { value: 'testpassword' } });
    //     fireEvent.click(loginButton);

    //     // Check if login function was called
    //     await waitFor(() =>
    //         expect(useAuth().login).toHaveBeenCalledWith('test@test.com', 'testpassword')
    //     );
    // });

    // test that login rejects when given incorrect email and password and displays error message
    test('shows an error message when login fails', async () => {
        const { useAuth } = require('../../hooks/useAuth');

        const mockLogin = useAuth().login;
        (useAuth().login as jest.Mock) = mockLogin;

        render(<SignInForm />);

        const emailField = screen.getByLabelText('Email:');
        const passwordField = screen.getByLabelText('Password:');
        const loginButton = screen.getByText('Login');

        fireEvent.change(emailField, { target: { value: 'wrong@email.com' } });
        fireEvent.change(passwordField, { target: { value: 'wrongpassword' } });
        fireEvent.click(loginButton);

        const errorMessage = await screen.findByText('Incorrect username or password');
        expect(errorMessage).toBeInTheDocument();
    });

    // test that alert message is displayed on successful login
    test('displays alert welcome message on successful login', async () => {
        const { useAuth } = require('../../hooks/useAuth');
        const mockLogin = useAuth().login;
        (useAuth().login as jest.Mock) = mockLogin;

        // console.log('mockLogin', mockLogin, mockLogin());
        render(<SignInForm />);

        const emailField = screen.getByLabelText('Email:');
        const passwordField = screen.getByLabelText('Password:');
        const loginButton = screen.getByText('Login');

        fireEvent.change(emailField, { target: { value: 'test@test.com' } });
        fireEvent.change(passwordField, { target: { value: 'testpassword' } });
        fireEvent.click(loginButton);

        await waitFor(() => expect(window.alert).toHaveBeenCalled());
        expect(window.alert).toHaveBeenCalledWith('Welcome back!');
    });
});
