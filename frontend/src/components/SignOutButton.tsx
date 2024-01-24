import { useAuth } from '../hooks/useAuth';

const LogoutButton = () => {
    const { logout: signOut } = useAuth();

    return <button onClick={signOut}>Logout</button>;
};

export default LogoutButton;
