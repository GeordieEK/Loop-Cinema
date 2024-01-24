import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.navbar}>
            <button className={styles.links} onClick={() => navigate('/')}>
                Home
            </button>
            <div className={styles.links}>
                <button onClick={() => navigate('/reviews')} className={styles.link}>
                    Reviews
                </button>
                {/* <button onClick={() => navigate('/users')} className={styles.link}>
                    Users
                </button> */}
                <button onClick={() => navigate('/analytics')} className={styles.link}>
                    Analytics
                </button>
                <button onClick={() => navigate('/movies')} className={styles.link}>
                    Movies
                </button>
            </div>
        </div>
    );
};

export default Navbar;
