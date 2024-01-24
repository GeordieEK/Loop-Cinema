/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '../../components/SignUpForm';
import { AuthProvider } from '../../context/AuthProvider';
import { QueryClientProvider, QueryClient } from 'react-query';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Mock useAuth hook
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
        isValidEmail: jest.fn((email) => {
            if (email === 'test@test.com') {
                return true;
            }
            return false;
        }),
        isNewEmail: jest.fn((email) => {
            if (email === 'test@test.com') {
                return true;
            }
            return false;
        }),
        isValidPassword: jest.fn((password) => {
            if (password === 'testpassword') {
                return true;
            }
            return false;
        }),
    }),
}));

describe('SignUpForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test that SignUpForm renders without crashing
    test('renders SignUpForm component without crashing', () => {
        <QueryClientProvider client={new QueryClient()}>
            <SignUpForm />
        </QueryClientProvider>;
    });

    // test that form fields update when user inputs text
    it('updates state on user input', () => {
        render(
            <QueryClientProvider client={new QueryClient()}>
                <SignUpForm />
            </QueryClientProvider>
        );
        act(() => {
            fireEvent.change(screen.getByLabelText(/email:/i), {
                target: { value: 'test@email.com' },
            });
        });

        // Now you can assert on the updated state or DOM
        expect(screen.getByLabelText(/email:/i)).toHaveValue('test@email.com');
    });

    // test that form fields are rendered correctly
    test('renders form fields', () => {
        render(
            <AuthProvider>
                <QueryClientProvider client={new QueryClient()}>
                    <SignUpForm />
                </QueryClientProvider>
            </AuthProvider>
        );
        const nameField = screen.getByLabelText(/Name:/i);
        const emailField = screen.getByLabelText(/email:/i);
        const passwordFields = screen.getAllByLabelText(/password:/i);
        const passwordField = passwordFields[0];
        const confirmPasswordField = passwordFields[1];

        expect(nameField).toBeInTheDocument();
        expect(emailField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
        expect(confirmPasswordField).toBeInTheDocument();
    });

    // test that correct password criteria error message is displayed when password doesn't fit criteria
    test('displays password criteria when login is attempted with inappropriate password', async () => {
        const { useAuth } = require('../../hooks/useAuth');
        const mockLogin = useAuth().login;
        (useAuth().login as jest.Mock) = mockLogin;

        render(
            <AuthProvider>
                <QueryClientProvider client={new QueryClient()}>
                    <SignUpForm />
                </QueryClientProvider>
            </AuthProvider>
        );

        const nameField = screen.getByLabelText(/Name:/i);
        const emailField = screen.getByLabelText(/email:/i);
        const passwordFields = screen.getAllByLabelText(/password:/i);
        const passwordField = passwordFields[0];
        const confirmPasswordField = passwordFields[1];
        const submitButton = screen.getByText(/Submit/i);

        act(() => {
            userEvent.type(nameField, 'test');
            userEvent.type(emailField, 'test@test.com');
            userEvent.type(passwordField, 'test');
            userEvent.type(confirmPasswordField, 'test');
            userEvent.click(submitButton);
        });

        await waitFor(async () => {
            const passwordCriteria = await screen.findByText(/Password does not meet criteria./i);
            expect(passwordCriteria).toBeInTheDocument();
        });
    });
});
