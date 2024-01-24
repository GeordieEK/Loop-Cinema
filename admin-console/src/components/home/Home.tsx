import React from 'react';
import Analytics from '../analytics/Analytics';
import Reviews from '../reviews/Reviews';
import Movies from '../movies/Movies';
import styles from './Home.module.css';

const Home: React.FC = () => {
    return (
        <div className={styles.grid}>
            <div className={styles.item}>
                <Reviews />
            </div>
            <div className={styles.item}>
                <Analytics />
            </div>
            <div className={styles.item}>
                <Movies />
            </div>
        </div>
    );
};

export default Home;
