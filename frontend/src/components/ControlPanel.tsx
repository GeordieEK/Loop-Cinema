import './styles/ControlPanel.css';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useReservations } from '../hooks/useReservations';

/*
    ControlPanel was a testing tool. It is not used in the final site.
    TODO: I have commented things out as they don't fit with new useUser, can refactor if needed again.
*/

function ControlPanel() {
    const { login, logout } = useAuth();
    const { fetchRemainingSeatsBySessionId } = useReservations();
    // const { addUser, deleteUser, updateUser } = useUser();

    const testSignUp = () => {
        // addUser('Buttery Ken', 'ken@western-star.com.au', 'Butt3ryK3n!');
    };

    const testSignIn = () => {
        login('ken@western-star.com.au', 'Butt3ryK3n!');
    };

    const testSignOut = () => {
        logout();
    };

    const testDelete = () => {
        // deleteUser();
    };

    const testUpdate = () => {
        // updateUser('Regular Ken', 'i_hate_margarine@western-star.com.au', 'Butt3ryK3n!');
    };

    // const testPrint = () => {
    //     console.log('userData:');
    //     console.log(auth.getUserData);
    //     console.log('userIdsByEmail:');
    //     console.log(auth.getUserIdsByEmail);
    // };

    const testfetchRemainingSeatsBySessionId = () => {
        fetchRemainingSeatsBySessionId(1)
        
    }

    return (
        <div className="control_panel_wrapper">
            <button className="control_panel_button" onClick={testfetchRemainingSeatsBySessionId}>
                Remaining seats
            </button>
        </div>
    );
}

export default ControlPanel;
